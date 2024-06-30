const express = require("express");
const asyncHandler = require("express-async-handler");
const json = require("json");
const Person = require("../models/person");
const Program = require("../models/program"); //?


const router = express.Router();    

// GET home page.
router.get('/', function(req, res, next) {
    res.render('people-list', { title: 'People List' });
});


// GET request for fetching people list under a specific program
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

        // Render the people list template with the fetched data
        res.render('people-list', { title: 'People List', program });
    } catch (err) {
        // Handle any errors that occur during fetching
        console.error('Error fetching program details:', err);
        res.status(500).send(err.message);
    }
}));


//GET request for creating people.
router.get('/create', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: People create GET");
}));


// POST request for creating people.
router.post('/create', asyncHandler(async (req, res, next) => {
    const name =  req.body.name;
    const dateJoined = req.body.dateJoined; 
    const beneficiaryStatus = req.body.beneficiaryStatus;
    const benefitRequested = req.body.benefitRequested;
    const benefitReceived = req.body.benefitReceived;
    const dateReceived = req.body.dateReceived;

    const newPerson = new Person({
        name: name,
        dateJoined: dateJoined,
        beneficiaryStatus: beneficiaryStatus,
        benefitRequested: benefitRequested,
        benefitReceived: benefitReceived,
        dateReceived: dateReceived
    });

    await newPerson.save();
    res.redirect('/'); // Redirect to home page or any other appropriate page after saving.

    console.log("New people instance saved.");
}));


module.exports = router;