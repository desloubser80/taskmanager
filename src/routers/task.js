const express = require('express')
const router = new express.Router();
const Task = require('../models/task');

router.delete('/tasks/:id', async(req,res)=> {
    try{
        var task = await Task.findByIdAndDelete(req.params.id);
        if (!task){
            res.status(404).send("No such task");
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send()
    }
})


router.patch('/tasks/:id', async (req,res) => {
    var updates = Object.keys(req.body);
    var allowedUpgrades = ['description','completed'];
    var isValid = updates.every((update) => {
        return allowedUpgrades.includes(update);
    })
    if (!isValid){
        return res.send("Operation not allowed") 
    }

    try{
        var task = await Task.findById(req.params.id)

        updates.forEach((update) =>{
            console.log(task[update])
            task[update] = req.body[update]
        })
        await task.save()
        

        if (!task){
            return res.status(404).send('No such task')
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send()
    }
})

router.post('/tasks',async (req,res) => {
    try{
        const task = new Task(req.body);
        await task.save();
        res.status(201).send();
    }catch(e){
        res.status(500).send(); 
    }
})

router.get('/tasks',async (req,res)=>{
    try{
        var tasks = await Task.find({});
        res.status(200).send(tasks);
    }catch(e){
        res.status(500).send(e);
    }
})

router.get('/tasks/:id', async (req,res)=>{
    try{
        const _id = req.params.id;
        var task = await Task.findById(_id);
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e);
    }
})

module.exports = router