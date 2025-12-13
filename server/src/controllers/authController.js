const db = require('../models');
const User = db.User;
const Role = db.Role;
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        console.log(req.body);
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Content can not be empty!" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in Registered!" });
        }

        // Default to 'user' role if not specified
        let roleName = 'user';
        if (role) {
            roleName = role;
        }

        const foundRole = await Role.findOne({ where: { name: roleName } });
        if (!foundRole) {
            return res.status(400).json({ message: `Role '${roleName}' does not exist.` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            roleId: foundRole.id
        });

        res.status(201).json({
            message: 'User registered successfully!', user: {
                name: user.username,
                email: user.email,
                role: foundRole.name,
                id: user.id
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
            include: Role // Include Role to get the role name
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({ accessToken: null, message: 'Invalid Password!' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.Role.name },
            process.env.JWT_SECRET,
            { expiresIn: 86400 } // 24 hours
        );

        // Send token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.Role.name,
            accessToken: token,
            message: "Login successful"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ message: "You've been signed out!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Expiration time (10 minutes)
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = otpExpires;
        await user.save();

        // Send Email
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Error sending email" });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: "OTP sent to email!" });
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({
            where: {
                email,
                resetPasswordOtp: otp,
                resetPasswordExpires: { [Sequelize.Op.gt]: Date.now() } // Check if not expired
            }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid OTP or OTP has expired!" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetPasswordOtp = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        // req.userId comes from authMiddleware
        const userId = req.userId;
        const { username, email } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully!", user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
