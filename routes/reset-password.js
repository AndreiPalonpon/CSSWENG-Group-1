const express = require('express');
const router = express.Router();
const path = require("path");
const Password = require('../models/password'); 

// GET reset-password page.
router.get("/", (req, res) => {
    res.sendFile(path.resolve('./views/reset-password.html'));
});

module.exports = router;