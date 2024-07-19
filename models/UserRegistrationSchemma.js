const mongoose = require('mongoose');

const profilePictureSchema = new mongoose.Schema({
    filename: {
        type: String,
        // required: true
    },
    filepath: {
        type: String,
        // required: true
    },
    filetype: {
        type: String,
        // required: true
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    profilePicture: {
        type: profilePictureSchema,
        // required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const UserRegistration = mongoose.model('UserRegistration', userSchema);

module.exports = UserRegistration;