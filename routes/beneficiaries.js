const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const json = require("json");
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
        stat, 
        benefitDelivered, 
        date_received
    } = req.body;

    const newBeneficiary = new Beneficiary({ 
        person_registered: personRegistered, 
        program_enrolled: programEnrolled, 
        status: stat, 
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
    const beneficiaries = await Beneficiary.find()
                                           .sort({ first_name: 1, last_name: 1})
                                           .exec();

    console.log(beneficiaries);
    res.render("beneficiary-list", { beneficiaries: beneficiaries });
}));

//GET request for one beneficiary.
router.get('/:id', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Beneficiary detail");
}));

module.exports = router;