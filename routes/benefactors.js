const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Benefactor = require("../models/benefactor");

// Session Authenticator
function requireAuth(req, res, next) {
    console.log("Checking authentication...");
    if (req.session.user && req.session.user.authenticated) {
        console.log("User is authenticated. Proceeding to benefactors page...");
        next(); 
    } else {
        console.log("User is not authenticated. Redirecting to login page...");
        res.redirect('/login');
    }
}

router.use(requireAuth);

// GET request to list all benefactors
router.get('/', asyncHandler(async (req, res, next) => {
    const benefactors = await Benefactor.find()
                                        .sort({ name: 1 })
                                        .exec();

    console.log(benefactors);
    res.render("benefactor-list", { benefactors: benefactors });
}));

// POST request for creating benefactor.
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

// POST request for updating benefactor
router.get('/edit', asyncHandler(async (req, res, next) => { //Change to post. POST will be used.
    const { id, name, type } = req.body;

    if (name === "" || type === "") {
        res.sendStatus(400); // HTTP 400: Bad Request
    }

    const benefactor = {
        name: name,
        type: type,
    };

    await Program.updateOne({_id: id}, benefactor);

    res.sendStatus(200);
}));

// POST request for deleting benefactor
router.post('/delete', asyncHandler(async (req, res, next) => {
    //Check first if there are benefits from the current benefactor. If there are, he or she cannot be deleted.
    await Benefactor.deleteOne({_id: req.body.id});
    console.log("Benefactor ID " + req.body.id + " has been deleted.");
    res.sendStatus(200);
}));

// GET request for one benefactor.
router.get('/:id', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Benefactor detail");
}));

module.exports = router;