const express = require('express');
const UserRegistration = require('../models/UserRegistrationSchemma');
const authenticateUser = require('../middleware/UserAuthentication');
const router = express.Router();

// Route for fetching user details by email
router.get('/user/:email', authenticateUser, async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        const user = await UserRegistration.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user details:', err.message);
        res.status(500).json({ message: 'Error fetching user details', error: err.message });
    }
});

// Route for updating user details
router.put('/user/update/:email', authenticateUser, async (req, res) => {
    const { email } = req.params;
    const { name, profilePicture, mobile, address1, address2 } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        const updatedData = {
            name,
            profilePicture,
            mobile,
            address1,
            address2
        };

        const updatedUser = await UserRegistration.findOneAndUpdate({ email }, updatedData, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error('Error updating user details:', err.message);
        res.status(500).json({ message: 'Error updating user details', error: err.message });
    }
});

module.exports = router;
