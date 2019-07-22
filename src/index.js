const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user'); 
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, ()=>{
    console.log("Server is running on port "+ port);
})


const Task = require('./models/task')
const User = require('./models/user')

const main = async ()=> {
    // const task = await Task.findById('5d3564c598ae4a57cccafe3e')
    // await task.populate('owner').execPopulate();
    // console.log(task.owner)
   
    // const user = await User.findById('5d355bf9e278b354548db285');
    // await user.populate('tasks').execPopulate()
    // console.log(user.tasks);
}

main()