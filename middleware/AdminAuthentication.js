const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const adminUserId = process.env.ADMIN_USER;

const AdminAuthentication = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);

        if (decoded.userId === adminUserId) {
            req.user = { userId: decoded.userId, role: 'admin' };
            next();
        } else {
            res.status(403).json({ message: 'Access denied. Admins only.' });
        }
    } catch (err) {
        console.error('Token verification error:', err);

        if (err.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Token has expired, please log in again' });
        } else {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    }
};

module.exports = AdminAuthentication;