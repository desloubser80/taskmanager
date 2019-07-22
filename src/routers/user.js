const express = require('express')
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

//create new user
router.post('/users',async (req,res)=>{
    const user = new User(req.body);
    try{
        await user.save()
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
 
module.exports = router;