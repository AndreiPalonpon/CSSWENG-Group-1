const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const json = require("json");
const Benefit = require("../models/benefit");

//GET request for creating item.
router.get('/create', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item create GET");
}));

//POST request for creating beneficiary.
router.post('/create', asyncHandler(async (req, res, next) => {
    const { benefitName, benefitDesc, quantity, dateReceived, benefactor } = req.body;

    const newBenefit = new Benefit({
        name: benefitName,
        description: benefitDesc,
        quantity: quantity,
        date_received: dateReceived,
        benefactor: benefactor
    });

    await newBenefit.save();

    console.log("New device instance saved.");
    res.redirect('/device');
    res.sendStatus(201);
}));

//GET request for editing item.
router.get('/:id/edit', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item edit GET");
}));

//POST request for editing item.
router.post('/:id/edit', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item edit POST");
}));

//GET request for deleting item. 
router.get('/:id/delete', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item delete GET");
}));

//POST request for deleting item. 
router.post('/:id/delete', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item delete POST");
}));

//GET request to list all equipment.
router.get('/', asyncHandler(async (req, res, next) => {
    const benefits = await Benefit.find()
                                  .exec();

    console.log(benefits);
    res.render("benefit-list", { benefits: benefits });
}));


//GET request for one item.
router.get('/:id', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item detail");
}));

module.exports = router;