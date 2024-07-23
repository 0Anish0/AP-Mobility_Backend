const express = require('express');
const UserRegistration = require('../models/UserRegistrationSchemma'); // Importing UserRegistration schema
const UserVerification = require('../models/UserVerificationSchemma'); // Importing UserVerification schema
const { generateOTP, sendOTP, storeOTP } = require('../services/OtpServices'); // Importing from OtpServices
const authenticateUser = require('../middleware/UserAuthentication');

const router = express.Router();

router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await UserRegistration.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "You don't have an account. Please create an account." });
        }

        const otp = generateOTP();

        storeOTP(email, otp);
        let userVerification = await UserVerification.findOne({ email });
        if (!userVerification) {
            userVerification = new UserVerification({
                name: user.name,
                email,
                otp,
                otpExpires: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
            });
        } else {
            userVerification.name = user.name;
            userVerification.otp = otp;
            userVerification.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        }

        await userVerification.save();
        await sendOTP(email, otp);
        res.json({ message: 'OTP sent successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Error sending OTP', error: err });
    }
});

router.post('/resend-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await UserRegistration.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "You don't have an account. Please create an account." });
        }

        const otp = generateOTP();

        storeOTP(email, otp);
        let userVerification = await UserVerification.findOne({ email });
        if (!userVerification) {
            userVerification = new UserVerification({
                name: user.name,
                email,
                otp,
                otpExpires: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
            });
        } else {
            userVerification.name = user.name;
            userVerification.otp = otp;
            userVerification.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        }

        await userVerification.save();
        await sendOTP(email, otp);
        res.json({ message: 'OTP resent successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Error resending OTP', error: err });
    }
});

router.get('/protected-route', authenticateUser, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;