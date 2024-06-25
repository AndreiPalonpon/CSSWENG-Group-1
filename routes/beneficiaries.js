const express = require("express");
const asyncHandler = require("express-async-handler");
const Beneficiary = require("../models/beneficiary");

const router = express.Router();    

//GET request for creating beneficiary.
router.get('/create', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Beneficiary create GET");
}));

//POST request for creating beneficiary.
router.post('/create', asyncHandler(async (req, res, next) => {
    const { firstName, lastName, dob, gender, contactNo, 
            barangay, disabilityType, comorbidities, pwdIdCardNo}
          = req.body;

    console.log(firstName, lastName, dob, gender, contactNo, 
        barangay, disabilityType, comorbidities, pwdIdCardNo);
    const newBeneficiary = new Beneficiary({ first_name: firstName, 
                                             last_name: lastName, 
                                             date_of_birth: dob, 
                                             gender: gender, 
                                             contact_number: contactNo, 
                                             barangay: barangay, 
                                             disability_type: disabilityType, 
                                             comorbidities: comorbidities, 
                                             pwd_card_id_no: pwdIdCardNo,
                                            });
    await newBeneficiary.save();

    console.log("New beneficiary instance saved.");
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