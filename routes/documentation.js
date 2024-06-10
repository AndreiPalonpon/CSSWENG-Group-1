const express = require("express");
const path = require("path");
const router = express.Router();

//GET documentation page.
router.get("/", function (req, res) {
    res.sendFile(path.resolve('./views/program-documentation.html'));
});

module.exports = router;