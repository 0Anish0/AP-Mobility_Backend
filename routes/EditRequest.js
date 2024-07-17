const express = require('express');
const Request = require('../models/CreateRequestSchemma');
const authenticateUser = require('../middleware/UserAuthentication');
const router = express.Router();

router.put('/request/:requestId', authenticateUser, async (req, res) => {
    try {
        const { requestId } = req.params;
        const updates = { ...req.body };
        delete updates.requestId;
        delete updates.status;
        const request = await Request.findOneAndUpdate({ requestId }, updates, {
            new: true,
            runValidators: true
        }).exec();

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json(request);
    } catch (err) {
        console.error('Error updating request:', err);
        res.status(500).json({ message: 'Error updating request', error: err.message });
    }
});

module.exports = router;