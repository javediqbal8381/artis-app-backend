const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    active: Boolean,
    role:{
        type:String,
        enum:["admin", "seller", "buyer"]
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
