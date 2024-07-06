const express = require("express");
const router = express.Router();

// POST logout
router.post('/', async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        console.log("User is logged out...");
        res.redirect('/login'); // Redirect to /login after logout

    });
});

module.exports = router;
