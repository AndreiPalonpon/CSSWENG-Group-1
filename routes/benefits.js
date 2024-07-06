const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const json = require("json");
const Benefit = require("../models/benefit");
const Benefactor = require("../models/benefactor");

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

//GET request to list all equipment.
router.get('/', asyncHandler(async (req, res, next) => {
    const benefits = await Benefit.find()
                                  .populate("benefactor")
                                  .exec();

    const benefactors = await Benefactor.find()
                                        .exec();

    console.log(benefits, benefactors);
    res.render("benefit-list", { benefactors: benefactors, benefits: benefits });
}));


//GET request for creating item.
router.get('/create', asyncHandler(async (req, res, next) => {
    
}));

//POST request for creating beneficiary.
router.post('/create', asyncHandler(async (req, res, next) => {
    const { benefitName, benefitDesc, quantity, dateReceived, benefactor } = req.body;

    const newBenefit = new Benefit({
        name: benefitName,
        description: benefitDesc,
        quantity: quantity,
        date_received: dateReceived,
        benefactor: benefactor
    });

    await newBenefit.save();

    console.log("New benefit instance saved.");
    res.redirect('/benefits');
    res.sendStatus(201);
}));

//POST request for editing item.
router.post('/:id/edit', asyncHandler(async (req, res, next) => { //Change to post. POST will be used.
    //Example...
    //req.body will be implemented later.
    const id = "6680c8ace7e6a0a3c2d72f7e";
    const updatedBenefit = {
        
    };

    await Benefit.findByIdAndUpdate(id, updatedBenefit);

    //res.sendStatus(200);
    res.redirect("/benefits/");
}));


//POST request for deleting item. 
router.post('/delete', asyncHandler(async (req, res, next) => {
    //Check first if there are beneficiaries with the current benefit. If there are, it cannot be deleted.
    
    await Benefit.deleteOne({_id: req.body.benefit_id});
    console.log("Benefit ID " + req.body.benefit_id + " has been deleted.");
    res.sendStatus(200);
}));

//GET request for one item.
router.get('/:id', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item detail");
}));

module.exports = router;