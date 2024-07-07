const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const Password = require('../models/user');

// Need session authenticator to prevent access

// GET request to display Change Password page
router.get("/", requireAuth, function (req, res) {
    res.sendFile(path.resolve('./views/change-password.html'));
});

// POST request for password change
router.post('/', async (req, res) => {
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'New passwords do not match' });
    }

    try {
        // Fetch the current password instance from the database
        const passwordDoc = await Password.findOne();

        if (!passwordDoc) {
            return res.status(404).json({ message: 'Password not found' });
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password
        passwordDoc.password = hashedPassword;
        await passwordDoc.save();

        // Password changed successfully
        res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
