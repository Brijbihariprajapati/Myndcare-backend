const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        require:true
    },
    options:{
        type:[String],
        require:true
    },
    correctOption:{
        type: Number,
        require:true
    }
})

const Question = mongoose.model('Question',QuestionSchema)

module.exports = Question