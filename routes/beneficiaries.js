const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const json = require("json");
const Program = require("../models/program");
const Person = require("../models/person");
const Benefit = require("../models/benefit");
const Beneficiary = require("../models/beneficiary");

// Session Authenticator
function requireAuth(req, res, next) {
    console.log("Checking authentication...");
    if (req.session.user && req.session.user.authenticated) {
        console.log("User is authenticated. Proceeding to beneficiaries page...");
        next();
    } else {
        console.log("User is not authenticated. Redirecting to login page...");
        res.redirect('/login');
    }
}

router.use(requireAuth);

/ GET request to list all beneficiaries
/*
router.get('/', asyncHandler(async(req, res) => {
    const people = await Person.find().sort({ first_name: 1, last_name: 1 }).exec();
    const programs = await Program.find().sort({ name: 1 }).exec();
    const benefits = await Benefit.find().sort({ name: 1 }).exec();
    const beneficiaries = await Beneficiary.find()
        .populate("person_registered")
        .populate("program_enrolled")
        .populate("benefit_delivered")
        .exec();

    console.log(beneficiaries);
    res.render("beneficiary-list", {
        people,
        programs,
        benefits,
        beneficiaries
    });
}));
*/

// GET request to list all beneficiaries with sorting and filtering
router.get('/', asyncHandler(async(req, res) => {
    const { recipientSort, statusFilter, benefitSort, dateSort, programId } = req.query;

    let sortOptions = {};
    let filterOptions = { program_enrolled: programId };

    if (recipientSort) {
        sortOptions['person_registered.name'] = recipientSort === 'az' ? 1 : -1;
    }

    if (statusFilter) {
        filterOptions.status = { $in: statusFilter.split(',') };
    }

    if (benefitSort) {
        sortOptions['benefit_delivered.name'] = benefitSort === 'az' ? 1 : -1;
    }

    if (dateSort) {
        sortOptions.date_received = dateSort === 'newest' ? -1 : 1;
    }

    // Logging for debugging
    console.log('Filter Options:', filterOptions);
    console.log('Sort Options:', sortOptions);

    const people = await Person.find().sort({ first_name: 1, last_name: 1 }).exec();
    const programs = await Program.find().sort({ name: 1 }).exec();
    const benefits = await Benefit.find().sort({ name: 1 }).exec();
    const beneficiaries = await Beneficiary.find(filterOptions)
        .populate("person_registered")
        .populate("program_enrolled")
        .populate("benefit_delivered")
        .sort(sortOptions)
        .exec();

    console.log('Filtered Beneficiaries:', beneficiaries);

    res.render("beneficiary-list", {
        people,
        programs,
        benefits,
        beneficiaries
    });
}));

router.get('/:id', asyncHandler(async(req, res) => {
    const programId = req.params.id; // Correctly extract the program ID from URL parameter
    const program = await Program.findById(programId); // Assuming Program model is used

    if (!program) {
        // Handle if program is not found, perhaps redirect or show an error
        return res.status(404).send('Program not found');
    }

    const people = await Person.find().sort({ first_name: 1, last_name: 1 }).exec();
    const programs = await Program.find().sort({ name: 1 }).exec();
    const benefits = await Benefit.find().sort({ name: 1 }).exec();

    // Find beneficiaries where program_enrolled matches the program ID
    const beneficiaries = await Beneficiary.find({ program_enrolled: programId })
        .populate("person_registered")
        .populate("program_enrolled")
        .populate("benefit_delivered")
        .exec();

    res.render("beneficiary-list", {
        program,
        people,
        programs,
        benefits,
        beneficiaries
    });
}));

// POST request for creating beneficiary
router.post('/create', asyncHandler(async (req, res) => {
    const programId = req.body.programEnrolled; // Extract programEnrolled from req.body
    const program = await Program.findById(programId); // Assuming Program model is used

    if (!program) {
        // Handle if program is not found, perhaps show an error or redirect
        return res.status(404).send('Program not found');
    }

    const {
        personRegistered,
        status,
        benefitDelivered,
        date_received
    } = req.body;

    console.log(personRegistered);

    const newBeneficiary = new Beneficiary({
        person_registered: personRegistered,
        program_enrolled: programId, // Use programId here
        status,
        benefit_delivered: benefitDelivered,
        date_received
    });

    await newBeneficiary.save();

    console.log("New beneficiary instance saved.");
    
    // Redirect to the beneficiaries page with the programId parameter
    res.redirect(`/beneficiaries/${programId}`);
}));


// POST request for editing beneficiary
router.post('/edit', asyncHandler(async (req, res) => {
    const {
        id,
        person_registered,
        program_enrolled,
        status,
        benefit_delivered,
        date_received
    } = req.body;

    const beneficiary = {
        person_registered,
        program_enrolled,
        status,
        benefit_delivered,
        date_received
    };

    await Program.updateOne({ _id: id }, beneficiary);

    res.sendStatus(200); // HTTP 200: OK
}));

// POST request for deleting beneficiary
router.post('/delete', asyncHandler(async (req, res) => {
    console.log(req.body.beneficiary_id);
    await Beneficiary.deleteOne({ _id: req.body.beneficiary_id });
    console.log(`Beneficiary ID ${req.body.beneficiary_id} has been deleted.`);
    res.sendStatus(200); // HTTP 200: OK
}));


module.exports = router;
