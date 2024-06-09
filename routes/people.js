const express = require("express");
const asyncHandler = require("express-async-handler");
const json = require("json");
const People = require("../models/people");

const router = express.Router();    

// GET home page.
router.get('/', function(req, res, next) {
    res.render('people-list', { title: 'People List' });
});

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

    const newPeople = new People({
        name: name,
        dateJoined: dateJoined,
        beneficiaryStatus: beneficiaryStatus,
        benefitRequested: benefitRequested,
        benefitReceived: benefitReceived,
        dateReceived: dateReceived
    });

    await newPeople.save();
    res.redirect('/'); // Redirect to home page or any other appropriate page after saving.

    console.log("New people instance saved.");
}));


module.exports = router;