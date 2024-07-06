const express = require("express");
const path = require("path");

const router = express.Router();

const JWT_SECRET = "eWZiZTdiMjRjMmYwM2YxNjNlMjI0YzI4MjMyZjI5ZGIxMzExZjQxYzZiMmM4N2M0"

// GET forgot-password page.
router.get("/", (req, res) => {
    res.sendFile(path.resolve('./views/forgot-password.html'));
});

module.exports = router;