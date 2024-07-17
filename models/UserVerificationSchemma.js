const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    otpExpires: {
        type: Date,
        required: true
    },
});

User = mongoose.model('UserVerification', userSchema);
module.exports = User;