const express = require("express");
const path = require("path");
const router = express.Router();

//GET Contact Us page.
router.get("/", function (req, res) {
    res.sendFile(path.resolve('./views/contactus.html'));
});

module.exports = router;