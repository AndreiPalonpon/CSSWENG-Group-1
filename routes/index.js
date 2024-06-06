const express = require("express");
const router = express.Router();

//GET home page.
router.get("/", function (req, res) {
    res.sendFile("../views/dashboard", {root: __dirname })
});

module.exports = router;