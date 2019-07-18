const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./routers/user'); 
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

app.use((req,res,next)=> {
    if(req.method){
        return res.status(503).send("CURRENTLY UNDER CONSTRUCTION. PLEASE FFFTTTTSSSEKKK")
    }
    next();
});

app.use((req,res,next)=> {
    if(req.method==="GET"){
        return res.send("IXNAY")
    }
    next();
});


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, ()=>{
    console.log("Server is running on port "+ port);
})

// const jwt = require('jsonwebtoken')
// const myFunction = async () => {
//     const token = jwt.sign({ _id:'abc123' }, 'thisismynewcourse', {expiresIn : '7 seconds'});
//     console.log(token);
    
//     const data = jwt.verify(token,'thisismynewcourse' );
//     console.log(data)
// }

// myFunction()