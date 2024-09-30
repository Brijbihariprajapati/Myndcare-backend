const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: Number, // assuming status is numeric
        required: true,
        default: 0
    },
    image: {
        type: String, // assuming you're storing the image path or URL
    }
});

const User = mongoose.model('User', schema);
module.exports = User;
