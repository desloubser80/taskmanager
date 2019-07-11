require('../src/db/mongoose');
const User = require('../src/models/user');

//"5d24367e62cc1651dbe94898"

// User.findByIdAndUpdate('5d2335dde291bc172c755c06', {age : 80}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age : 80})
// }).then((count)=>{
//     console.log("Count",count);
// }).catch((e)=>{
//     console.log(e);
// })

const doWork = async(id,age)=>{
    var user = await User.findByIdAndUpdate(id, {age : age});
    console.log(user);
    var count = await User.countDocuments({age : age});
    return(count)
}

doWork('5d2335dde291bc172c755c06',90).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log("Error: ",e);
})