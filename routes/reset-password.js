const express = require("express");
const path = require("path");

const router = express.Router();

// GET reset-password page.
router.get("/", (req, res) => {
    res.sendFile(path.resolve('./views/reset-password.html'));
});

// POST for reset-password
router.post("/", (req, res) => {
    const { password } = req.body;
});

module.exports = router;