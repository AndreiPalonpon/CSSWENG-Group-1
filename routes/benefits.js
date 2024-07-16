const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const json = require("json");
const Benefit = require("../models/benefit");
const Benefactor = require("../models/benefactor");

// Session Authenticator
function requireAuth(req, res, next) {
    console.log("Checking authentication...");
    if (req.session.user && req.session.user.authenticated) {
        console.log("User is authenticated. Proceeding to benefits page...");
        next();
    } else {
        console.log("User is not authenticated. Redirecting to login page...");
        res.redirect('/login');
    }
}

router.use(requireAuth);

// GET request to list all benefits
router.get('/', asyncHandler(async (req, res) => {
    const benefits = await Benefit.find().populate("benefactor").sort({ name: 1 }).exec();
    const benefactors = await Benefactor.find().exec();

    console.log(benefits, benefactors);
    res.render("benefit-list", { benefactors, benefits });
}));

// POST request for creating benefit
router.post('/create', asyncHandler(async (req, res) => {
    const { benefitName, benefitDesc, quantity, dateReceived, benefactor } = req.body;

    const newBenefit = new Benefit({
        name: benefitName,
        description: benefitDesc,
        quantity,
        date_received: dateReceived,
        benefactor
    });

    await newBenefit.save();

    console.log("New benefit instance saved.");
    res.redirect('/benefits');
    res.sendStatus(201); // HTTP 201: Created
}));

// POST request for editing benefit
router.post('/edit', asyncHandler(async (req, res) => {
    const {
        benefit_id,
        name,
        description,
        quantity,
        date_received,
        benefactor
    } = req.body;

    if (name === "") {
        res.sendStatus(400); // HTTP 400: Bad Request
    }

    const benefit = {
        name,
        description,
        quantity,
        date_received,
        benefactor
    };

    await Benefit.updateOne({ _id: benefit_id }, benefit);

    res.sendStatus(200); // HTTP 200: OK
}));

// POST request for deleting benefit
router.post('/delete', asyncHandler(async (req, res) => {
    // Check first if there are beneficiaries with the current benefit. If there are, it cannot be deleted.
    await Benefit.deleteOne({ _id: req.body.benefit_id });
    console.log(`Benefit ID ${req.body.benefit_id} has been deleted.`);
    res.sendStatus(200); // HTTP 200: OK
}));

// GET request for one benefit
router.get('/:id', asyncHandler(async (req, res) => {
    res.send("NOT IMPLEMENTED: Benefit detail");
}));

module.exports = router;
