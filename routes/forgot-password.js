const express = require("express");
const path = require("path");
const jwt = require('jsonwebtoken')


const router = express.Router();

// GET forgot-password page.
router.get("/", (req, res) => {
    res.sendFile(path.resolve('./views/forgot-password.html'));
});

router.post("/change", (req, res) => {
    const { email } = req.body;
    res.send(email);
});

module.exports = router;