const express = require('express');
const UserRegistration = require('../models/UserRegistrationSchemma'); 
const authenticateUser = require('../middleware/UserAuthentication');
const router = express.Router();

router.get('/user/:email', authenticateUser, async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await UserRegistration.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user details:', err);
        res.status(500).json({ message: 'Error fetching user details', error: err.message });
    }
});

module.exports = router;