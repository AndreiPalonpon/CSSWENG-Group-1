const express = require("express");
const path = require("path");
const router = express.Router();
const Password = require('../models/password'); 

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
            res.status(200).json({ message: 'Login successful', redirectUrl: '/' });
        } else {
            res.status(401).json({ error: 'Login unsuccessful. Please try again.' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
