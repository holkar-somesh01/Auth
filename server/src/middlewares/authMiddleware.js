const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    let token = req.cookies.token; // Check cookie first

    // If not in cookie, check Authorization header
    if (!token && req.headers['authorization']) {
        const authHeader = req.headers['authorization'];
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7, authHeader.length);
        }
    }

    if (!token) {
        return res.status(403).json({ message: 'No token provided!' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized!' });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(403).json({ message: 'Require ' + roles.join(' or ') + ' Role!' });
        }
        next();
    };
};

const isAdmin = checkRole(['admin']);
const isModerator = checkRole(['moderator']);
const isUser = checkRole(['user', 'admin', 'moderator']); // Generally logged in users

module.exports = {
    verifyToken,
    checkRole,
    isAdmin,
    isModerator
};
