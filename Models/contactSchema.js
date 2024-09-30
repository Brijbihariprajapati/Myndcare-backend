const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    message:{
        type:String,
        require:true
    },
    createdAt: { type: Date, default: Date.now },

})

const Contact = mongoose.model('Contact',Schema)
module.exports = Contact