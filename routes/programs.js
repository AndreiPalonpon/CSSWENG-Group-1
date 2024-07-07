const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const json = require("json");
const Program = require("../models/program");

// Session Authenticator
function requireAuth(req, res, next) {
    console.log("Checking authentication...");
    if (req.session.user && req.session.user.authenticated) {
        console.log("User is authenticated. Proceeding to programs page...");
        next(); 
    } else {
        console.log("User is not authenticated. Redirecting to login page...");
        res.redirect('/login');
    }
}

router.use(requireAuth);

//GET request to list all programs
router.get('/', asyncHandler(async (req, res, next) => {
    const programs = await Program.find()
                                  .sort({ name: 1 })
                                  .exec();

    //res.send(allPrograms);
    //console.log(programs);
    res.render("program-list", { programs: programs });
}));

//GET request for creating program
router.get('/create', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program create GET");
}));

//POST request for creating program.
router.post('/create', asyncHandler(async (req, res, next) => {
    
    const { programName, programType, frequency, assistanceType } = req.body;

    const program = {
        name: programName,
        program_type: programType,
        frequency: frequency,
        assistance_type: assistanceType
    };

    await Program.create(program);

    console.log("New program instance saved.");
    res.sendStatus(201); // HTTP 201: Created
}));

//GET request for editing program.
router.get('/:id/edit', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program edit GET");
}));

//POST request for editing program.
router.post('/edit', asyncHandler(async (req, res) => {
    const {program_id, program_name, program_type, 
           program_frequency, program_assistance_type} = req.body

    if (program_name === "") {
        res.sendStatus(400); // HTTP 400: Bad Request
    }

    const program = {
        name: program_name,
        program_type: program_type,
        frequency: program_frequency,
        assistance_type: program_assistance_type
    };

    await Program.updateOne({_id: program_id}, program);

    res.sendStatus(200);
}));

//GET request for deleting program. 
router.get('/:id/delete', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program delete GET");
}));

//POST request for deleting program
router.post('/delete', asyncHandler(async (req, res, next) => {
    await Program.deleteOne({_id: req.body.program_id});
    console.log("Program ID " + req.body.program_id + " has been deleted.");
    res.sendStatus(200);
}));

//GET request for one program
router.get('/:id', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Program detail");
}));

module.exports = router;
