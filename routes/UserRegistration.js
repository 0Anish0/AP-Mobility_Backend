const express = require('express');
const multer = require('multer');
const User = require('../models/UserRegistrationSchemma');
const { generateOTP, sendOTP } = require('../services/OtpServices');
const router = express.Router();

const otpStore = {};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

router.post('/register', upload.single('profilePicture'), async (req, res) => {
    const { name, mobile, address1, address2, email, otp } = req.body;
    const picture = req.file;

    if (!name || !picture || !mobile || !address1 || !email || !otp) {
        return res.status(400).json({ message: 'Name, profilePicture, mobile, address1, email, and OTP are required' });
    }

    try {
        const storedOTP = otpStore[email];
        if (!storedOTP || storedOTP !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const profilePicture = {
            filename: picture.filename,
            filepath: picture.path,
            filetype: picture.mimetype
        };

        const user = new User({
            name,
            profilePicture,
            mobile,
            address1,
            address2,
            email,
            
        });

        await user.save();
        delete otpStore[email];

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Error registering user', error: err });
    }
});

router.post('/register/:otp', async (req, res) => {
    const { email } = req.body;

    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: 'This email is associated with another account' });
    }

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const otp = generateOTP();
        otpStore[email] = otp;

        await sendOTP(email, otp);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error('Error sending OTP:', err);
        res.status(500).json({ message: 'Error sending OTP', error: err.message });
    }
});

module.exports = router;



// const express = require('express');
// const multer = require('multer');
// const User = require('../models/UserRegistrationSchemma');
// const { generateOTP, sendOTP } = require('../services/OtpServices');
// const router = express.Router();

// const otpStore = {};

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

// // File filter to allow only specific file types
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'), false);
//     }
// };

// const upload = multer({ 
//     storage: storage,
//     fileFilter: fileFilter
// });

// // Route to register a user with OTP verification
// router.post('/register', upload.single('profilePicture'), async (req, res) => {
//     const { name, mobile, address1, address2, email, otp } = req.body;
//     const picture = req.file;

//     if (!name || !picture || !mobile || !address1 || !email || !otp) {
//         return res.status(400).json({ message: 'Name, profilePicture, mobile, address1, email, and OTP are required' });
//     }

//     try {
//         const storedOTP = otpStore[email];
//         if (!storedOTP || storedOTP !== otp) {
//             return res.status(400).json({ message: 'Invalid or expired OTP' });
//         }

//         const profilePicture = {
//             filename: picture.filename,
//             filepath: picture.path,
//             filetype: picture.mimetype
//         };

//         const user = new User({
//             name,
//             profilePicture,
//             mobile,
//             address1,
//             address2,
//             email,
//         });

//         await user.save();
//         delete otpStore[email];

//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (err) {
//         console.error('Error registering user:', err);
//         res.status(500).json({ message: 'Error registering user', error: err });
//     }
// });

// // Route to send OTP
// router.post('register/:send-otp', async (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         return res.status(400).json({ message: 'Email is required' });
//     }

//     try {
//         const user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({ message: 'This email is associated with another account' });
//         }

//         const otp = generateOTP();
//         otpStore[email] = otp;

//         await sendOTP(email, otp);
//         res.status(200).json({ message: 'OTP sent successfully' });
//     } catch (err) {
//         console.error('Error sending OTP:', err);
//         res.status(500).json({ message: 'Error sending OTP', error: err.message });
//     }
// });

// // Route to verify OTP
// router.post('register/:verify-otp', async (req, res) => {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//         return res.status(400).json({ message: 'Email and OTP are required' });
//     }

//     try {
//         const storedOTP = otpStore[email];
//         if (!storedOTP || storedOTP !== otp) {
//             return res.status(400).json({ message: 'Invalid or expired OTP' });
//         }

//         // OTP is valid, remove from store
//         delete otpStore[email];
//         res.status(200).json({ message: 'OTP verified successfully' });
//     } catch (err) {
//         console.error('Error verifying OTP:', err);
//         res.status(500).json({ message: 'Error verifying OTP', error: err.message });
//     }
// });

// module.exports = router;