const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const json = require("json");
const Program = require("../models/program");
const Person = require("../models/person");
const Benefit = require("../models/benefit");
const Beneficiary = require("../models/beneficiary");


//GET request for creating beneficiary.
router.get('/create', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Beneficiary create GET");
}));

//POST request for creating beneficiary.
router.post('/create', asyncHandler(async (req, res, next) => {
    const { 
        personRegistered, 
        programEnrolled, 
        status, 
        benefitDelivered, 
        date_received
    } = req.body;

    console.log(personRegistered);

    const newBeneficiary = new Beneficiary({ 
        person_registered: personRegistered, 
        program_enrolled: programEnrolled, 
        status: status, 
        benefit_delivered: benefitDelivered, 
        date_received: date_received
    });
    
    await newBeneficiary.save();

    console.log("New beneficiary instance saved.");
    res.redirect('/beneficiaries');
    res.sendStatus(201);
}));


//GET request for editing beneficiary.
router.get('/:id/edit', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Beneficiary edit GET");
}));

//POST request for editing beneficiary.
router.post('/:id/edit', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Beneficiary edit POST");
}));

//GET request for deleting beneficiary. 
router.get('/:id/delete', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Beneficiary delete GET");
}));

//POST request for deleting beneficiary. 
router.post('/:id/delete', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Beneficiary delete POST");
}));

//GET request to list all beneficiaries.
router.get('/', asyncHandler(async (req, res, next) => {
    const people = await Person.find()
                               .sort({ first_name: 1, last_name: 1})
                               .exec();

    const programs = await Program.find()
                                  .sort({ name: 1 })
                                  .exec();
    
    const benefits = await Benefit.find()
                                  .sort({ name: 1 })
                                  .exec();

    const beneficiaries = await Beneficiary.find()
                                           .populate("person_registered")
                                           .populate("program_enrolled")
                                           .populate("benefit_delivered")
                                           .exec();

    console.log(beneficiaries);
    res.render("beneficiary-list", {
                people: people,
                programs: programs,
                benefits, benefits,
                beneficiaries: beneficiaries 
            });
}));

//GET request for one beneficiary.
router.get('/:id', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Beneficiary detail");
}));

module.exports = router;