const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const Password = require('../models/user');

const checkForgotPasswordCompletion = function (req, res, next) {
    if (req.session.forgotPasswordCompleted) {
        next();
    } else {
        res.status(403).send("Forgot password process not completed.");
    }
};

router.use(checkForgotPasswordCompletion);

// GET request to display Change Password page
router.get("/", function (req, res) {
    res.sendFile(path.resolve('./views/reset-password.html'));
});

// POST request for password change
router.post('/', async (req, res) => {
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'New passwords do not match' });
    }

    try {
        const userDoc = await Password.findOne();

        if (!userDoc) {
            return res.status(404).json({ message: 'User not found' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        userDoc.password = hashedPassword;
        await userDoc.save();

        console.log('Password updated successfully');
        res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
