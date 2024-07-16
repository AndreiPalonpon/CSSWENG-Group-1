const express = require("express");
const router = express.Router();
const path = require("path");

// Session Authenticator
function requireAuth(req, res, next) {
    console.log("Checking authentication...");
    if (req.session.user && req.session.user.authenticated) {
        console.log("User is authenticated. Proceeding to settings page...");
        next(); 
    } else {
        console.log("User is not authenticated. Redirecting to login page...");
        res.redirect('/login');
    }
}


//GET request to display Settings page
router.get("/", requireAuth, function (req, res) {
    res.sendFile(path.resolve('./views/settings.html'));
});

module.exports = router;