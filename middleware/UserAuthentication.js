const jwt = require('jsonwebtoken');
const User = require('../models/UserVerificationSchemma');

const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: 'Invalid token. User not found.' });
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            res.status(401).json({ message: 'Invalid token.' });
        } else if (err.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Token expired.' });
        } else {
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
};

module.exports = authenticateUser;