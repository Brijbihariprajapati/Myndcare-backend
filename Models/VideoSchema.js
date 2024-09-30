const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    video:{
        type:String,
        require:true
    },
    title:{
        type:String,
        require:true
    },
    scores:[],
    status:{
        type: Number,
        default:0
    }
})

const Videos = mongoose.model('Videos', schema)
module.exports = Videos