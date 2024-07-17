const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const adminId = process.env.ADMIN_USER;
const adminPass = process.env.ADMIN_PASS;

router.post('/login', (req, res) => {
    const { userId, password } = req.body;

    if (userId === adminId && password === adminPass) {
        const token = jwt.sign({ userId: adminId }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;