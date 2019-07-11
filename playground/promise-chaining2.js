require('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findByIdAndDelete('5d24407a868e8d58a7c90348').then((task)=>{
//     console.log(task);
//     return  Task.count({completed : false})
// }).then((count)=>{
//         console.log(count);
// }).catch((e)=>{
//     console.log('Error: ',e)
// })

const deleteTaskAndCount = async(id) =>{
    var task = await Task.findByIdAndDelete(id)
    var count = await Task.count({completed : false})
    return {task,count}
}

deleteTaskAndCount('5d234bf32091501de6427530').then((result)=>{
    console.log(result)
}).catch((e)=> {
    console.log(e)
})