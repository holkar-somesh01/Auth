const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin, checkRole } = require('../middlewares/authMiddleware');

// Public Access
router.get('/public', (req, res) => {
    res.status(200).send("Public Content.");
});

// User Access (Logged In)
router.get('/user', [verifyToken], (req, res) => {
    res.status(200).send("User Content. (Authenticated)");
});

// Admin Access
router.get('/admin', [verifyToken, isAdmin], (req, res) => {
    res.status(200).send("Admin Content. (Only Admin)");
});

// Moderator Access
router.get('/mod', [verifyToken, checkRole(['moderator'])], (req, res) => {
    res.status(200).send("Moderator Content.");
});

module.exports = router;
