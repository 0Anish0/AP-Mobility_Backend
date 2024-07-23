const express = require('express');
const Request = require('../models/CreateRequestSchemma');
const router = express.Router();
const authenticateUser = require('../middleware/UserAuthentication');

router.get('/all-requests/:email', authenticateUser, async (req, res) => {
    try {
        const requests = await Request.find().exec();
        res.status(200).json(requests);
    } catch (err) {
        console.error('Error fetching requests:', err);
        res.status(500).json({ message: 'Error fetching requests', error: err.message });
    }
});

router.get('/request/:requestId', authenticateUser, async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await Request.findOne({ requestId }).exec();
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json(request);
    } catch (err) {
        console.error('Error fetching request by ID:', err);
        res.status(500).json({ message: 'Error fetching request by ID', error: err.message });
    }
});


module.exports = router;