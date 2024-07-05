const express = require("express");
const path = require("path");
const router = express.Router();

//GET forgot-password page.
router.get("/", function (req, res) {
    res.sendFile(path.resolve('./views/forgot-password.html'));
});

module.exports = router;