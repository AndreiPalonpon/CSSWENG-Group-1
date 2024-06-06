const express = require("express");
const path = require("path");
const router = express.Router();

//GET home page.
router.get("/", function (req, res) {
    res.sendFile(path.resolve('./views/dashboard.html'));
});

module.exports = router;