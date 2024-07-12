const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Session Authenticator
function requireAuth(req, res, next) {
    console.log("Checking authentication...");
    if (req.session.user && req.session.user.authenticated) {
        console.log("User is authenticated. Proceeding to change password page...");
        next(); 
    } else {
        console.log("User is not authenticated. Redirecting to login page...");
        res.redirect('/login');
    }
}

// GET request to display Change password page
router.get("/", requireAuth, function (req, res) {
    res.sendFile(path.resolve('./views/change-password.html'));
});

// POST request for password change
router.post('/', async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'New passwords do not match' });
    }

    try {
        // Retrieve the user instance with username 'LPPWDFI'
        const userDoc = await User.findOne({ username: 'LPPWDFI' });

        if (!userDoc) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, userDoc.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        userDoc.password = await bcrypt.hash(newPassword, salt);
        await userDoc.save();

        res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Error during password change:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
