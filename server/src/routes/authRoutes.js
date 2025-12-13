const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware'); // Import verifyToken

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);
router.post('/logout', controller.logout);
router.put('/profile', [verifyToken], controller.updateProfile); // Protected route

module.exports = router;
