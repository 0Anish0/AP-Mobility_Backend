const express = require('express');
const Request = require('../models/CreateRequestSchemma');
const AdminAuthentication = require('../middleware/AdminAuthentication');

const router = express.Router();

router.get('/request-counts', AdminAuthentication, async (req, res) => {
    try {
        const totalRequestCount = await Request.countDocuments().exec();
        const pendingCount = await Request.countDocuments({ status: 'Initiated' }).exec();
        const inProgressCount = await Request.countDocuments({ status: 'InProgress' }).exec();
        const completedCount = await Request.countDocuments({ status: 'Completed' }).exec();
        const rejectedCount = await Request.countDocuments({ status: 'Rejected' }).exec();

        res.status(200).json({
            totalRequestCount,
            pendingCount,
            inProgressCount,
            completedCount,
            rejectedCount
        });
    } catch (err) {
        console.error('Error fetching request counts:', err);
        res.status(500).json({ message: 'Error fetching request counts', error: err.message });
    }
});

module.exports = router;
