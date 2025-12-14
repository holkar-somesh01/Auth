const db = require('../models');
const User = db.User;
const Role = db.Role;
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const sendEmail = require('../utils/email');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


exports.register = catchAsync(async (req, res, next) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        console.error("Error in register: Content cannot be empty");
        return next(new AppError("Content can not be empty!", 400));
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        console.error("Error in register: Email already registered:", email);
        return next(new AppError("Email is already in Registered!", 400));
    }

    // Default to 'user' role if not specified
    let roleName = 'user';
    if (role) {
        roleName = role;
    }

    const foundRole = await Role.findOne({ where: { name: roleName } });
    if (!foundRole) {
        console.error("Error in register: Role does not exist:", roleName);
        return next(new AppError(`Role '${roleName}' does not exist.`, 400));
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
});


exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email },
        include: Role // Include Role to get the role name
    });

    if (!user) {
        console.error("Error in login: User not found:", email);
        return next(new AppError('User not found.', 404));
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
        console.error("Error in login: Invalid Password for user:", email);
        return next(new AppError('Invalid Password!', 401));
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
});

exports.logout = catchAsync(async (req, res, next) => {
    res.clearCookie('token');
    return res.status(200).json({ message: "You've been signed out!" });
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
        console.error("Error in forgotPassword: User not found:", email);
        return next(new AppError("User not found!", 404));
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Expiration time (10 minutes)
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = otpExpires;
    await user.save();

    // Send Email
    const otpTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #4CAF50; text-align: center;">Password Reset Request</h2>
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #333;">You have requested to reset your password. Please use the following OTP to proceed:</p>
            <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; font-weight: bold; color: #333; letter-spacing: 5px; background-color: #f4f4f4; padding: 10px 20px; border-radius: 4px;">${otp}</span>
            </div>
            <p style="font-size: 14px; color: #666;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
            <p style="font-size: 14px; color: #666; margin-top: 20px;">Best Regards,<br/>Your App Team</p>
        </div>
    `;

    try {
        await sendEmail({
            subject: 'Password Reset OTP',
            to: email,
            message: otpTemplate
        });
        res.status(200).json({ message: "OTP sent to email!" });
    } catch (error) {
        console.error("Error in forgotPassword: Email sending failed:", error);
        return next(new AppError("Error sending email: " + error.message, 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
        where: {
            email,
            resetPasswordOtp: otp,
            resetPasswordExpires: { [Sequelize.Op.gt]: Date.now() } // Check if not expired
        }
    });

    if (!user) {
        console.error("Error in resetPassword: Invalid or expired OTP for email:", email);
        return next(new AppError("Invalid OTP or OTP has expired!", 400));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully!" });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
    // req.userId comes from authMiddleware
    const userId = req.userId;
    const { username, email } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
        console.error("Error in updateProfile: User not found ID:", userId);
        return next(new AppError("User not found!", 404));
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
});
