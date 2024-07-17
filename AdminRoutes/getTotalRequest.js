const express = require('express');
const Request = require('../models/CreateRequestSchemma');
const AdminAuthentication = require('../middleware/AdminAuthentication');

const router = express.Router();

// Get requests by status and populate user details
router.get('/requests/:status', AdminAuthentication, async (req, res) => {
    const { status } = req.params;
    try {
        const requests = await Request.find({ status })
            .populate('createdBy', 'name')
            .exec();
        res.status(200).json(requests);
    } catch (err) {
        console.error('Error fetching requests by status:', err);
        res.status(500).json({ message: 'Error fetching requests by status', error: err.message });
    }
});

// Route to get monthly request data
router.get('/monthly-requests', async (req, res) => {
    try {
        const monthlyRequests = await Request.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);
        const monthlyRequestCounts = Array(12).fill(0);

        monthlyRequests.forEach(item => {
            monthlyRequestCounts[item._id - 1] = item.count;
        });

        res.json({ monthlyRequests: monthlyRequestCounts });
    } catch (error) {
        console.error('Error fetching monthly request data:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;