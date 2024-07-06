const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const json = require("json");
const Program = require("../models/program");

// Session Authenticator
function requireAuth(req, res, next) {
    console.log("Checking authentication...");
    if (req.session.user && req.session.user.authenticated) {
        console.log("User is authenticated. Proceeding...");
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

//POST request for creating program
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

    const newProgram = new Program({ 
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

//POST request for editing program
router.get('/edit', asyncHandler(async (req, res, next) => { //change to post. POST will be used.
    //Example...
    //req.body will be implemented later.
    const id = "6680add4a97d019a89a329f1";
    const updatedProgram = {
        name: "Program 1",
        program_type: "Service",
    };

    await Program.findByIdAndUpdate(id, updatedProgram);

    //res.sendStatus(200);
    res.redirect("/programs/");
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
