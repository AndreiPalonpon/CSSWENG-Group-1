const express = require("express");
const path = require("path");
const router = express.Router();

//GET request about page
router.get("/", function (req, res) {
    res.sendFile(path.resolve('./views/about.html'));
});

module.exports = router;