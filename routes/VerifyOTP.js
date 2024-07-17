const express = require('express');
const UserVerification = require('../models/UserVerificationSchemma');
const jwt = require('jsonwebtoken');

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
        const user = await UserVerification.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpires < Date.now()) {
            // OTP has expired, delete the document
            await user.deleteOne();
            return res.status(400).json({ message: 'OTP has expired' });
        }

        const token = jwt.sign({ _id: user._id, email: user.email }, jwtSecret, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error verifying OTP', error: err });
    }
});

module.exports = router;