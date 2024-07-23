const express = require('express');
const multer = require('multer');
const path = require('path');
const Request = require('../models/CreateRequestSchemma');
const AdminAuthentication = require('../middleware/AdminAuthentication');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Define where you want to store the uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

router.put('/request-status/:requestId', AdminAuthentication, upload.single('receipt'), async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;
        const receiptFile = req.file;

        // Validate status
        if (!['Initiated', 'InProgress', 'Completed', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value. Allowed values are: Initiated, Pending, Completed.' });
        }

        const updateData = { status };

        if (receiptFile) {
            updateData.receipt = {
                filename: receiptFile.filename,
                filepath: receiptFile.path,
                filetype: receiptFile.mimetype
            };
        }

        // Update request status
        const updatedRequest = await Request.findOneAndUpdate(
            { requestId },
            { $set: updateData }, // Use $set to update specific field
            {
                new: true,
                runValidators: true
            }
        ).exec();

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json(updatedRequest);

    } catch (err) {
        console.error('Error updating request status:', err);
        res.status(500).json({ message: 'Error updating request status', error: err.message });
    }
});

module.exports = router;