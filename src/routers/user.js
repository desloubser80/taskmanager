const express = require('express')
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const {sendWelcomeEmail} = require('../emails/account')

const upload = multer({
    limits : {
        fileSize : 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('Please upload a picture'))
        }
        cb(undefined,true)    
    } 
});

//create new user
router.post('/users',async (req,res)=>{
    const user = new User(req.body);
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken();
        res.status(201).send({user, token})
    }catch(e){
        res.status(400).send()
    }
})

//log in user
router.post('/users/login', async(req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken();
        res.send({user, token})
    }
    catch(e){
        res.status(400).send();
    }
})

//log out user
router.post('/users/logout', auth, async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
                 return token.token !== req.token;
            })
        await req.user.save();
        res.status(200).send('You have logged out')
    }catch(e){
        res.status(501)
    }
})

router.post('/users/logoutAll', auth, async (req,res)=> {
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send(req.user)
    }catch(e){
        res.status(501)
    }
})

//get all users
router.get('/users/me',auth, async (req,res)=>{
   res.send(req.user)
})

//update user
router.patch('/users/me',auth, async (req,res)=> {
    var updates = Object.keys(req.body);
    var allowedUpdates = ['name','age','email','password']
    var isValid = updates.every((update) => {
        return allowedUpdates.includes(update);
    })
    if (!isValid)
    {
        return res.status(400).send({error : "Invalid operation"});
    }
    
    try{
        updates.forEach((update)=>{
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(400).send(e);
    }
})

//delete user
router.delete('/users/me',auth, async (req,res) => {
    try{
        var user = await User.findByIdAndDelete(req.user._id);
        await user.remove()
        res.status(200).send(req.user);
    }
    catch(e){
        res.status(500).send(e);
    }
})

//upload profile picture
router.post('/users/avatar',auth, upload.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width : 250, height : 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send(200)
},(error,req,res,next)=>{
    res.status(400).send(error.message)
})

//upload profile picture
router.delete('/users/avatar',auth, async (req,res) => {
    req.user.avatar = undefined; 
    await req.user.save()
    res.send(200)
},(error,req,res,next)=>{
    res.status(400).send(error.message)
})

//fetching avatar
router.get('/users/:id/avatar',async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})
 
module.exports = router;