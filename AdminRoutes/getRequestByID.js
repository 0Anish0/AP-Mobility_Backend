const express = require('express');
const Request = require('../models/CreateRequestSchemma');
const AdminAuthentication = require('../middleware/AdminAuthentication');

const router = express.Router();

router.get('/requestss/:requestId', AdminAuthentication, async (req, res) => {
    const { requestId } = req.params;
    try {
        const request = await Request.findOne({ requestId })
            .populate('createdBy', 'name')
            .exec();
        if (request) {
            res.status(200).json(request);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    } catch (err) {
        console.error('Error fetching request by ID:', err);
        res.status(500).json({ message: 'Error fetching request by ID', error: err.message });
    }
});

module.exports = router;