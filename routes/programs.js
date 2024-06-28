const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const json = require("json");
const Program = require("../models/program");

//GET request for creating program.
router.get('/create', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program create GET");
}));

//POST request for creating program.
router.post('/create', asyncHandler(async (req, res, next) => {
    const { 
        programName, 
        programType, 
        freq, 
        assistanceType 
    } = req.body;

    /*var programName = req.body.programName;
    var programType = req.body.programType;
    var frequency = req.body.frequency;
    var assistanceType = req.body.assistanceType;*/

    var newProgram = new Program({ 
        name: programName, 
        program_type: programType, 
        frequency: freq, 
        assistance_type: assistanceType,
    });
    
    /*({  name: programName,
          program_type: programType,
          frequency: frequency,
          assitance_type: assistanceType
    });*/
    
    //newProgram.name = programName;
    //newProgram.assistance_type = assistanceType;   //For some reason these dont work properly, seperate calls are here so they 100% work           
    await newProgram.save();

    console.log("New program instance saved.");
    res.sendStatus(201); 
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
router.post('/delete', asyncHandler(async (req, res, next) => {
    await Program.deleteOne({_id: req.body.beneficiary_id});
    console.log("Beneficiary ID " + req.body.beneficiary_id + " has been deleted.");
    res.sendStatus(200);
}));

//POST request for deleting program. 
router.post('/delete', asyncHandler(async (req, res, next) => {
    await Program.deleteOne({_id: req.body.program_id});
    console.log("Program ID " + req.body.program_id + " has been deleted.");
    res.sendStatus(200);
}));

//GET request to list all programs.
router.get('/', asyncHandler(async (req, res, next) => {
    const programs = await Program.find()
                                  .sort({ name: 1 })
                                  .exec();

    //res.send(allPrograms);
    //console.log(programs);
    res.render("program-list", { programs: programs });
}));

// Helper function to convert comma-separated string to an array
const parseFilterValues = (filterValue) => {
    if (!filterValue) return [];
    return Array.isArray(filterValue) ? filterValue : filterValue.split(",");
};

// GET request to list all programs with filters.
router.get('/', asyncHandler(async(req, res, next) => {
    const { nameSort, typeFilter, frequencyFilter, assistanceFilter } = req.query;

    let filter = {};
    let sort = {};

    if (typeFilter) filter.programType = { $in: parseFilterValues(typeFilter) };
    if (frequencyFilter) filter.frequency = { $in: parseFilterValues(frequencyFilter) };
    if (assistanceFilter) filter.assistanceType = { $in: parseFilterValues(assistanceFilter) };

    if (nameSort === 'az') {
        sort.programName = 1; // ascending
    } else if (nameSort === 'za') {
        sort.programName = -1; // descending
    }

    const programs = await Program.find(filter).sort(sort).exec();

    res.render("program-list", { programs, filters: req.query });
}));

//GET request for one program.
router.get('/:id', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program detail");
}));

module.exports = router;
