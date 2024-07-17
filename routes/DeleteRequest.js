const express = require('express');
const Request = require('../models/CreateRequestSchemma');
const authenticateUser = require('../middleware/UserAuthentication');
const router = express.Router();

router.delete('/request/del/:requestId', authenticateUser, async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await Request.findOneAndDelete({ requestId }).exec();
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (err) {
        console.error('Error deleting request:', err);
        res.status(500).json({ message: 'Error deleting request', error: err.message });
    }
});

module.exports = router;