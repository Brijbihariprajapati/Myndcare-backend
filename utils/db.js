const mongoose =require('mongoose')
const URL =process.env.MONGODB_URL
const dbconnect = mongoose.connect(URL).then(()=>{
    console.log("Connection succesfull");
}).catch(error=>console.log(error))

module.exports ={dbconnect}