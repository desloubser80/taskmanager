const express = require('express')
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth')

router.post('/tasks', auth ,async (req,res) => {
    try{
        const task = new Task({
            ...req.body,
            owner : req.user._id
        })
        res.send(task);
        await task.save();
        res.status(201).send();
    }catch(e){
        res.status(500).send("OOPS"); 
    }
})

router.get('/tasks',auth,async (req,res)=>{
    try{
        var tasks = await Task.find({owner: req.user._id});
        res.status(200).send(tasks);
    }catch(e){
        res.status(500).send(e);
    }
})

router.get('/tasks/:id',auth, async (req,res)=>{
    try{
        const _id = req.params.id;
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send('No such task')
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e);
    }
})


router.delete('/tasks/:id',auth, async(req,res)=> {
    try{
        var task = await Task.deleteOne({_id:req.params.id,owner:req.user._id});
        if (!task){
            res.status(404).send("No such task");
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send( nope)
    }
})


router.patch('/tasks/:id',auth, async (req,res) => {
    var updates = Object.keys(req.body);
    var allowedUpgrades = ['description','completed'];
    var isValid = updates.every((update) => {
        return allowedUpgrades.includes(update);
    })
    if (!isValid){
        return res.send("Operation not allowed") 
    }

    try{
        var task = await Task.findOne({_id:req.params.id, owner : req.user._id})

        if (!task){
            return res.status(404).send('No such task')
        }

        updates.forEach((update) =>{
            console.log(task[update])
            task[update] = req.body[update]
        })
        await task.save()
               
        res.send(task)
    }
    catch(e){
        res.status(500).send()
    }
})





module.exports = router