const express = require("express");
const asyncHandler = require("express-async-handler");
const json = require("json");
const router = express.Router();
const Program = require("../models/program");

// GET home page.
router.get('/', function(req, res, next) {
    res.render('program-documentation', { title: 'Program Documentation' });
});

// GET request for program documentation
router.get('/:id', asyncHandler(async (req, res, next) => {
    try {
        // Fetch the program details by ID
        const program = await Program.findById(req.params.id);

        // Check if the program exists
        if (!program) {
            console.log('Program not found with ID:', req.params.id);
            return res.status(404).send('Program not found');
        }

        // Log the program details
        console.log('Program details:', program);

        // Render the program documentation template with the fetched data
        res.render('program-documentation', { title: 'Program Documentation', program });
    } catch (err) {
        // Handle any errors that occur during fetching
        console.error('Error fetching program details:', err);
        res.status(500).send(err.message);
    }
}));



module.exports = router;