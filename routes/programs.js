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

// GET request to list all programs
router.get('/', asyncHandler(async (req, res) => {
    const programs = await Program.find().sort({ name: 1 }).exec();
    res.render("program-list", { programs });
}));

// GET request for creating program
router.get('/create', asyncHandler(async (req, res) => {
    res.send("NOT IMPLEMENTED: Program create GET");
}));

// POST request for creating program
router.post('/create', asyncHandler(async (req, res) => {
    const { programName, programType, programFrequency, assistanceType } = req.body;

    const program = ({
        name: programName,
        program_type: programType,
        frequency: programFrequency,
        assistance_type: assistanceType
    });
    
    console.log(program);
    await Program.create(program);
    console.log("New program instance saved.");
    res.sendStatus(201); // HTTP 201: Created
}));

// GET request for editing program
router.get('/:id/edit', asyncHandler(async (req, res) => {
    res.send("NOT IMPLEMENTED: Program edit GET");
}));

// POST request for editing program
router.post('/edit', asyncHandler(async (req, res) => {
    const { program_id, programName, programType, programFrequency, assistanceType } = req.body;

    // Check if programName is provided
    if (!programName) {
        return res.status(400).send('Program Name is required'); // HTTP 400: Bad Request
    }

    try {
        // Check if the program exists
        const existingProgram = await Program.findById(program_id);
        if (!existingProgram) {
            return res.status(404).send('Program not found'); // HTTP 404: Not Found
        }

        // Update the program
        const updatedProgram = await Program.findByIdAndUpdate(program_id, {
            name: programName,
            program_type: programType,
            frequency: programFrequency,
            assistance_type: assistanceType
        }, { new: true });

        if (!updatedProgram) {
            return res.status(404).send('Program not found after update attempt'); // Handle if somehow update fails
        }

        return res.sendStatus(200); // HTTP 200: OK
    } catch (error) {
        console.error('Error updating program:', error);
        return res.status(500).send('Error updating program'); // HTTP 500: Internal Server Error
    }
}));

// GET request for deleting program
router.get('/:id/delete', asyncHandler(async (req, res) => {
    res.send("NOT IMPLEMENTED: Program delete GET");
}));

// POST request for deleting program
router.post('/delete', asyncHandler(async (req, res) => {
    await Program.deleteOne({ _id: req.body.program_id });
    console.log(`Program ID ${req.body.program_id} has been deleted.`);
    res.sendStatus(200); // HTTP 200: OK
}));

// GET request for one program
router.get('/:id', asyncHandler(async (req, res) => {
    res.send("NOT IMPLEMENTED: Program detail");
}));

module.exports = router;
