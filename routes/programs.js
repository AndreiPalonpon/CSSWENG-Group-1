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

// GET request to list all programs with sorting and filtering
router.get('/', asyncHandler(async(req, res) => {
    const { nameSort, typeFilter, frequencyFilter, assistanceTypeFilter, page = 1, limit = 20 } = req.query;

    let sortOptions = {};
    let filterOptions = {};

    if (nameSort) {
        sortOptions['name'] = nameSort === 'az' ? 1 : -1;
    }

    if (typeFilter) {
        filterOptions.program_type = { $in: typeFilter.split(',') };
    }

    if (frequencyFilter) {
        filterOptions.frequency = { $in: frequencyFilter.split(',') };
    }

    if (assistanceTypeFilter) {
        filterOptions.assistance_type = { $in: assistanceTypeFilter.split(',') };
    }

    // Logging for debugging
    console.log('Filter Options:', filterOptions);
    console.log('Sort Options:', sortOptions);

    const totalPrograms = await Program.countDocuments(filterOptions);
    //const programs = await Program.find(filterOptions).sort(sortOptions).exec();
    const programs = await Program.find(filterOptions)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .exec();

    console.log('Filtered Programs:', programs);

    res.render("program-list", {
        programs,
        currentPage: page,
        totalPages: Math.ceil(totalPrograms / limit),
        totalPrograms
    });
}));

// GET request for creating program
router.get('/create', asyncHandler(async(req, res) => {
    res.send("NOT IMPLEMENTED: Program create GET");
}));

// POST request for creating program
router.post('/create', asyncHandler(async(req, res) => {
    const { programName, programType, programFrequency, assistanceType } = req.body;

    const newProgram = ({
        name: programName,
        program_type: programType,
        frequency: programFrequency,
        assistance_type: assistanceType
    });

    console.log(newProgram);
    await Program.create(newProgram);
    console.log("New program instance saved.");
    res.sendStatus(201); // HTTP 201: Created
}));

// GET request for editing program
router.get('/:id/edit', asyncHandler(async(req, res) => {
    res.send("NOT IMPLEMENTED: Program edit GET");
}));



router.post('/edit', asyncHandler(async(req, res) => {
    const { id, name, program_type, frequency, assistance_type } = req.body;

    console.log("Received data:", req.body);

    if (!id || !name || !program_type || !frequency || !assistance_type) {
        console.log("Missing fields:", req.body);
        return res.status(400).json({ message: "All fields are required" });
    }

    const updateData = {
        name: name,
        program_type: program_type,
        frequency: frequency,
        assistance_type: assistance_type
    };

    try {
        const result = await Program.updateOne({ _id: id }, updateData);

        if (result.nModified === 0) {
            console.log("No changes made or program not found:", id);
            return res.status(404).json({ message: "Program not found or no changes made" });
        }

        console.log("Program updated successfully:", id);
        res.sendStatus(200);
    } catch (error) {
        console.error("Error updating program:", error);
        res.status(500).json({ message: "Internal server error" });

    }
}));


// GET request for deleting program
router.get('/:id/delete', asyncHandler(async(req, res) => {
    res.send("NOT IMPLEMENTED: Program delete GET");
}));

// POST request for deleting program
router.post('/delete', asyncHandler(async(req, res) => {
    await Program.deleteOne({ _id: req.body.program_id });
    console.log(`Program ID ${req.body.program_id} has been deleted.`);
    res.sendStatus(200);
}));

// GET request for one program
router.get('/:id', asyncHandler(async(req, res) => {
    res.send("NOT IMPLEMENTED: Program detail");
}));

module.exports = router;