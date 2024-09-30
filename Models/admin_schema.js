const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    }
})

const Admin = mongoose.model('Admin',schema)

module.exports = Admin