const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    age : {
        type : Number,
        validate(value){
            if (value < 0){
                throw new Error('Age must be greater than 0')
            }
        },
        default  : 0
    },
    email : {
        type  :String,
        required : true,
        trim: true,
        lowercase : true,
        unique  :true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Email is not valid');
            }
        }
    },
    password : {
        type : String,
        required : true,
        trim : true,
        validate(value){
            if(validator.contains(value,'password')){
                throw new Error ("password can not contain 'password'");
            }
        },
        validate(value){
            if(!validator.isLength(value,{min : 6})){
                throw new Error("Password must be 6 characters or more");
            }

        }
    },
    tokens : [{
        token : {
            type:String,
            required: true
        }

        
    }]
 
})

userSchema.virtual('tasks', {
    ref  : 'Task',
    localField : '_id',
    foreignField : 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    
    delete user.password;
    delete user.tokens;
    return user; 
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()},'thisismynewcourse');
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

userSchema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email : email})
    if (!user){
        throw new Error('No such user')
    } 
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to log in')
    }
    return user;
}

//hash plain text password
userSchema.pre('save', async function (next) {
    const user = this;
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next() 
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({owner : user._id})
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User;