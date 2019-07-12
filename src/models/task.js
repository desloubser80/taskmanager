const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    description : {
        type : String,
        required : true,
        trim : true
    },
    completed : {
        type : Boolean,
        default : false
    }
})

const Task = mongoose.model('task', userSchema)

module.exports = Task;