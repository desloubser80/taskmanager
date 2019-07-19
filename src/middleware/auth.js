const jwt = require('jsonwebtoken');
const User = require ('../models/user');
const auth = async (req,res,next)=>{
    try{
        var token = req.header('Authorization').replace('Bearer ','');
        var isValidToken = jwt.verify(token,'thisismynewcourse')
        const user = await User.findOne({ _id : isValidToken._id, 'tokens.token': token })
        if(!user){
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    }catch(e){
        res.status(401).send({'error' : "Not authenticated"});
    }
    
}

module.exports = auth;