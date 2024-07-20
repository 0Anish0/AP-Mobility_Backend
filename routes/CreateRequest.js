const express = require('express');
const router = express.Router();
const Request = require('../models/CreateRequestSchemma');
const multer = require('multer');
const path = require('path');
const authenticateUser = require('../middleware/UserAuthentication');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

router.post('/create-request', authenticateUser, upload.array('documents', 10), async (req, res) => {
    const { mobileNumber, description, timeToConnect, pickupAddress, language, date, time } = req.body;
    const files = req.files;

    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userName = user.name;
        const email = user.email;

        const documents = files.map(file => ({
            filename: `${Date.now()}-${file.originalname}`,
            filepath: file.path,
            filetype: file.mimetype
        }));

        const newRequest = new Request({
            mobileNumber,
            description,
            timeToConnect,
            pickupAddress,
            language,
            date,
            time,
            documents,
            createdBy: userName,
            email: email
        });

        await newRequest.save();
        res.status(201).json({ message: 'Request created successfully', request: newRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
