const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
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
        return next(new AppError('No token provided!', 403));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new AppError('Unauthorized!', 401));
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return next(new AppError('Require ' + roles.join(' or ') + ' Role!', 403));
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
