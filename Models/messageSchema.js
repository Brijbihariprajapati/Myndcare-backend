const mongoose = require('mongoose')
const schema =  new mongoose.Schema({
    message:{
        type:String,
        require:true
    },
    recipientEmail:{
        type:String,
        require:true
    },
    senderEmail:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    Date:{
        type:String
    }
})

const message = mongoose.model('message',schema)
module.exports = message