const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('user',{
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
    }
 
})

module.exports = User;