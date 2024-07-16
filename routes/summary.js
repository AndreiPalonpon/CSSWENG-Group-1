const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const json = require("json");

const Program = require("../models/program");
const Person = require("../models/person");
const Beneficiary = require("../models/beneficiary");
const Benefactor = require("../models/benefactor");
const Benefit = require("../models/benefit");
const Documentation = require("../models/documentation");

// Get request for summary.
router.get('/', asyncHandler(async (req, res) => {
    const totalProgramCount = await Program.find().count();
    const totalBenefitCount = await Benefit.find().count();
    const totalBenefactorCount = await Benefactor.find().count();

    //Program count by program type.
    const programCountByType = {
        assistance: await Program.find({ program_type: "Assistance"}).count(), 
        initiative: await Program.find({ program_type: "Initiative"}).count(), 
        service:    await Program.find({ program_type: "Service"}).count(), 
        program:    await Program.find({ program_type: "Program"}).count()
    };

    //Program count by program frequency.
    const programCountByFrequency = {
        monthly:        await Program.find({ frequency: "Monthly"}).count(), 
        quarterly:      await Program.find({ frequency: "Quarterly"}).count(), 
        semi_annual:    await Program.find({ frequency: "Semi-Annual"}).count(), 
        yearly:         await Program.find({ frequency: "Yearly"}).count()
    };

    //Program count by program assistance type.
    const programCountByAssistance = {
        educational: await Program.find({ assistance_type: "Educational"}).count(), 
        financial:   await Program.find({ assistance_type: "Financial"}).count(), 
        medical:     await Program.find({ assistance_type: "Medical"}).count()
    };

    //List of programs with aggregates.
    

    //Console log for testing.
    console.log(totalProgramCount, totalBenefitCount, totalBenefactorCount);
    console.log(programCountByType);
    console.log(programCountByFrequency);
    console.log(programCountByAssistance);

    //res.render("summary", { });
}));

module.exports = router;