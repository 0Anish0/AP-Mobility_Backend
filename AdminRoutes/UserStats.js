const express = require('express');
const User = require('../models/UserRegistrationSchemma');
const AdminAuthentication = require('../middleware/AdminAuthentication');

const router = express.Router();

router.get('/user-stats', AdminAuthentication, async (req, res) => {
    try {

        const latestUsersPromise = User.find().sort({ createdAt: -1 }).limit(5).exec();
        const totalUserCountPromise = User.countDocuments().exec();
        const allUsersPromise = User.find().exec();

        const [latestUsers, totalUserCount, allUsers] = await Promise.all([
            latestUsersPromise,
            totalUserCountPromise,
            allUsersPromise
        ]);

        res.status(200).json({
            latestUsers,
            totalUserCount,
            allUsers
        });
    } catch (err) {
        console.error('Error fetching user statistics:', err);
        res.status(500).json({ message: 'Error fetching user statistics', error: err.message });
    }
});

module.exports = router;