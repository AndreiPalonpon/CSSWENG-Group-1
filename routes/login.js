const express = require("express");
const path = require("path");
const router = express.Router();
const Password = require('../models/user'); 

// GET login page
router.get("/", function (req, res) {
    res.sendFile(path.resolve('./views/login.html'));
});

// POST login credentials
router.post('/', async (req, res) => {
    const { password } = req.body;

    try {
        const foundPassword = await Password.findOne({ password });

        if (foundPassword) {
            // Store user session data
            req.session.user = {
                username: 'LPPWDFI', // Set the username or other user data here
                authenticated: true
            };

            res.status(200).json({ message: 'Login successful', redirectUrl: '/' });
        } else {
            res.status(401).json({ error: 'Invalid password. Please try again.' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

