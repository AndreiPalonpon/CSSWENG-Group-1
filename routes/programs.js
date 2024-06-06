const express = require("express");
const asyncHandler = require("express-async-handler");
const moment = require("moment");
const Program = require("../models/program");

const router = express.Router();    

//GET request for creating program.
router.get('/create', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program create GET");
}));

//Not tested.
//POST request for creating program.
router.post('/create', asyncHandler(async (req, res, next) => {
    /*
    const programName = req.body.programName;
    const programType = req.body.programType;
    const frequency = req.body.frequency;
    const assitanceType = req.body.assistanceType;
    */

    const programName = "Program 4";
    const programType = "Service";
    const frequency = "Monthly";
    const assitanceType = "Educational";

    const newProgram = new Program({ name: programName,
                                     program_type: programType,
                                     frequency: frequency,
                                     assitance_type: assitanceType
                                  });
    await newProgram.save();

    res.send("New program instance saved.");
}));

//GET request for editing program.
router.get('/:id/edit', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program edit GET");
}));

//POST request for editing program.
router.post('/:id/edit', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program edit POST");
}));

//GET request for deleting program. 
router.get('/:id/delete', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program delete GET");
}));

//POST request for deleting program. 
router.post('/:id/delete', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program delete POST");
}));

//GET request to list all programs.
router.get('/', asyncHandler(async (req, res, next) => {
    const allPrograms = await Program.find()
                                     .sort({ name: 1 })
                                     .exec();

    //res.send(allPrograms);
    res.render("program-list", { programs: allPrograms, moment: moment });
}));

//GET request for one program.
router.get('/:id', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program detail");
}));

module.exports = router;