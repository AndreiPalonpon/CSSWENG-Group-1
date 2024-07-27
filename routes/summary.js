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

    const totalCounts = {
        programs: await Program.find().count(),
        benefits: await Benefit.find().count(),
        people: await People.find().count(),
        benefactors: await Benefactor.find().count()
    }

    //Program count by program type.
    const programCountsByType = {
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

    const programs = await Program.find()
                                .sort({ name: 1 })
                                .lean()
                                .exec();
    
    for (const program of programs) {
        const beneficiary_counts = await Beneficiary.aggregate([
                                    {
                                        $match: {
                                            program_enrolled: program._id,
                                        },
                                    },
                                    {
                                        $count: "beneficiary_count"
                                    }
                                ]);
        
        const benefit_counts = await Beneficiary.aggregate([
                                    {
                                        $match: {
                                            program_enrolled: program._id,
                                        },
                                    },
                                    {
                                        $group: {
                                            _id: "$benefit_delivered"
                                        }
                                    },
                                    {
                                        $count: "benefit_count"
                                    }
                                ]);
        
        const people_counts = await Beneficiary.aggregate([
                                    {
                                        $match: {
                                            program_enrolled: program._id,
                                        },
                                    },
                                    {
                                        $group: {
                                            _id: "$person_registered"
                                        }
                                    },
                                    {
                                        $count: "people_count"
                                    }
                                ]);

        const benefactor_counts = await Beneficiary.aggregate([
                                {
                                    $match: {
                                        program_enrolled: program._id,
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "benefits",
                                        localField: "benefit_delivered",
                                        foreignField: "_id",
                                        as: "benefit",
                                    },
                                },
                                {
                                    $unwind: "$benefit",
                                },
                                {
                                    $group: {
                                        _id: "$benefit.benefactor",
                                    }
                                },
                                {
                                    $count: "benefactor_count"
                                }
                            ]);

        program.beneficiary_count = beneficiary_counts[0].beneficiary_count;
        program.benefit_count = benefit_counts[0].benefit_count;
        program.people_count = people_counts[0].people_count;
        program.benefactor_count = benefactor_counts[0].benefactor_count;

        console.log(programs);
        
        res.render("summary", { 
                   totalCounts, 
                   programCountsByType, 
                   programCountByFrequency,
                   programCountByAssistance,
                   programs });
    }
}));

module.exports = router;