const express = require('express')
const router = new express.Router();
const User = require('../models/user');

router.post('/users',async (req,res)=>{
    const user = new User(req.body);
    try{
        await user.save()
        res.status(201).send()
    }catch(e){
        res.status(400).send()
    }
})

router.get('/users', async (req,res)=>{
    try{
        const users  = await User.find({})
        res.status(200).send(users)
    }catch(e){
        res.status(404).send()
    }
})

router.get('/users/:id', async (req,res)=>{
    const id = req.params.id
    try{
        var user = await User.findById(id) 
        if(!user)
        {
            return res.status(404).send()
        }
        res.status(200).send(user);
    }catch(e){
        res.status(500).send(); 
    }
})

router.patch('/users/:id', async (req,res)=> {
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
        const user = await User.findByIdAndUpdate(req.params.id, req.body,{new : true, runValidators : true})
        if(!user){
            return res.status(404).send();
        }
        res.send(user)
    }catch(e){
        res.status(400).send(e);
    }
})

router.delete('/users/:id', async (req,res) => {
    try{
        var user = await User.findByIdAndDelete(req.params.id);
        if (!user)
        {
            res.status(404).send("no such user");
        }
        res.status(200).send(user);
    }
    catch(e){
        res.status(500).send(e);
    }
})
 
module.exports = router;