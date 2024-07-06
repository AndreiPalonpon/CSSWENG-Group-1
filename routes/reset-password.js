const express = require('express');
const router = express.Router();
const path = require("path");
const Password = require('../models/password'); 

// GET reset-password page.
router.get("/", (req, res) => {
    res.sendFile(path.resolve('./views/reset-password.html'));
});

// POST route to handle password reset
router.post('/', async (req, res, next) => {
    const { id, newPassword } = req.body;

    try {
        // Find password by document ID and update password
        const updatedPassword = await Password.findByIdAndUpdate(
            id,
            { password: newPassword },
            { new: true }
        );

        if (!updatedPassword) {
            return res.status(404).send('Password not found');
        }

        res.status(200).send('Password updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;