const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    gmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },         
    avatar: { type: String, default: "" }       
});

const User = mongoose.model('User', userSchema);

module.exports = User;
