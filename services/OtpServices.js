const otpGenerator = require('otp-generator');
const transporter = require('../config/mailer');

const generateOTP = () => {
    return otpGenerator.generate(6, {
        digit: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    });
};

const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It is valid for 5 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Error sending OTP email');
    }
};

const otpStore = {};

const storeOTP = (email, otp) => {
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    otpStore[email] = { otp, expires: otpExpires };
};

const verifyOTP = (email, otp) => {
    const otpData = otpStore[email];
    if (!otpData) {
        return false;
    }
    const { otp: storedOTP, expires } = otpData;
    const isExpired = new Date() > expires;
    if (isExpired || storedOTP !== otp) {
        return false;
    }
    delete otpStore[email];
    return true;
};

module.exports = { generateOTP, sendOTP, storeOTP, verifyOTP };