const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const json = require("json");
const Device = require("../models/device");

//GET request for creating item.
router.get('/create', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item create GET");
}));

//POST request for creating beneficiary.
router.post('/create', asyncHandler(async (req, res, next) => {
    const { deviceName, deviceDesc, dateReceived, deviceSpon } = req.body;

    const newDevice = new Device({
        name: deviceName,
        description: deviceDesc,
        date_received: dateReceived,
        sponsor: deviceSpon
    });

    await newDevice.save();

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
    const devices = await Device.find()
                                           .exec();

    console.log(devices);
    res.render("device-list", { devices: devices });
}));


//GET request for one item.
router.get('/:id', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item detail");
}));

module.exports = router;