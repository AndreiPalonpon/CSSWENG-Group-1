const express = require("express");
const asyncHandler = require("express-async-handler");
const Benefactor = require("../models/benefactor");

const router = express.Router();    

//POST request for creating benefactor.
router.post('/create', asyncHandler(async (req, res, next) => {
    const { benefactorName, benefactorType } = req.body;

    const newBenefactor = new Benefactor({
        name: benefactorName,
        type: benefactorType,
    });

    await newBenefactor.save();

    console.log("New benefactor instance saved.");
    res.sendStatus(201); 
}));

//POST request for updating benefactor.
router.get('/edit', asyncHandler(async (req, res, next) => { //Change to post. POST will be used.
    //Example...
    //req.body will be implemented later.
    const id = "6680c8ace7e6a0a3c2d72f7e";
    const updatedProgram = {
        name: "Neo",
        type: "Person",
    };

    await Program.findByIdAndUpdate(id, updatedProgram);

    //res.sendStatus(200);
    res.redirect("/benefactors/");
}));

//POST request for deleting benefactor. 
router.post('/delete', asyncHandler(async (req, res, next) => {
    //Check first if there are benefits from the current benefactor. If there are, he or she cannot be deleted.
    await Benefactor.deleteOne({_id: req.body.benefactor_id});
    console.log("Benefactor ID " + req.body.benefactor_id + " has been deleted.");
    res.sendStatus(200);
}));

//GET request to list all benefactors.
router.get('/', asyncHandler(async (req, res, next) => {
    const benefactors = await Benefactor.find()
                                        .sort({ name: 1 })
                                        .exec();

    console.log(benefactors);
    res.render("benefactor-list", { benefactors: benefactors });
}));

//GET request for one benefactor.
router.get('/:id', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Benefactor detail");
}));

module.exports = router;