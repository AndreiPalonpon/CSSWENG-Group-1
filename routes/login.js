const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");
const User = require('../models/user'); 

// GET request to display Login page
router.get("/", function (req, res) {
    res.sendFile(path.resolve('./views/login.html'));
});

// POST request for login credentials
router.post('/', async (req, res) => {
    const { password } = req.body;

    try {
        // Retrieve the user instance with username 'LPPWDFI'
        const foundUser = await User.findOne({ username: 'LPPWDFI' });

        if (!foundUser) {
            return res.status(401).json({ error: 'Invalid password. Please try again.' });
        }

        const isMatch = await bcrypt.compare(password, foundUser.password);

        if (isMatch) {
            req.session.user = {
                username: foundUser.username,
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
