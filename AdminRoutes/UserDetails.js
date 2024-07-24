const express = require('express');
const AdminAuthentication = require('../middleware/AdminAuthentication');
const UserRegistration = require('../models/UserRegistrationSchemma');
const Request = require('../models/CreateRequestSchemma');
const router = express.Router();

// Fetch user details by email
router.get('/user-details/:email', AdminAuthentication, async (req, res) => {
    try {
        const { email } = req.params;
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

// Fetch requests by user email
router.get('/request/:email', AdminAuthentication, async (req, res) => {
    try {
        const { email } = req.params;
        const requests = await Request.find({ email });
        res.status(200).json(requests);
    } catch (err) {
        console.error('Error fetching requests by email:', err);
        res.status(500).json({ message: 'Error fetching requests by email', error: err.message });
    }
});

// Delete user by email
router.delete('/delete-user/:email', AdminAuthentication, async (req, res) => {
    try {
        const { email } = req.params;
        const user = await UserRegistration.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
});

// Block or unblock user by email
router.put('/block-user/:email', AdminAuthentication, async (req, res) => {
    try {
        const { email } = req.params;
        const { block } = req.body;
        const user = await UserRegistration.findOneAndUpdate({ email }, { $set: { isBlocked: block } }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const message = block ? 'User blocked successfully' : 'User unblocked successfully';
        res.status(200).json({ message, user });
    } catch (err) {
        console.error('Error updating user block status:', err);
        res.status(500).json({ message: 'Error updating user block status', error: err.message });
    }
});

module.exports = router;