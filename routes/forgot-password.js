const express = require("express");
const path = require("path");

const router = express.Router();

// GET forgot-password page.
router.get("/", (req, res) => {
    res.sendFile(path.resolve('./views/forgot-password.html'));
});

// POST for forgot-password
router.post("/", (req, res) => {
    const { email } = req.body;

    if (email !== user.email) {
        res.send('User not registered')
        return;
    }
});

module.exports = router;