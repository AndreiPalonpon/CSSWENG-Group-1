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
        console.log("User is authenticated. Proceeding to benefits page...");
        next(); 
    } else {
        console.log("User is not authenticated. Redirecting to login page...");
        res.redirect('/login');
    }
}

router.use(requireAuth);

// GET request to list all equipment
router.get('/', asyncHandler(async (req, res, next) => {
    const benefits = await Benefit.find()
                                  .populate("benefactor")
                                  .exec();

    const benefactors = await Benefactor.find()
                                        .exec();

    console.log(benefits, benefactors);
    res.render("benefit-list", { benefactors: benefactors, benefits: benefits });
}));
 
// POST request for creating beneficiary
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

// POST request for editing item
// router.post('/edit', asyncHandler(async (req, res, next) => { //Change to post. POST will be used.
//     const {benefit_id, name, description,
//            quantity, date_received,
//            benefactor } = req.body;
//
//     if  (name === "") {
//         res.sendStatus(400); // HTTP 400: Bad Request
//     }
//
//     const benefit = {
//         name: name,
//         description: description,
//         quantity: quantity,
//         date_received: date_received,
//         benefactor: benefactor
//     };
//
//     await Program.updateOne({_id: benefit_id}, benefit);
//     console.log(benefit);
//     res.sendStatus(200);
// }));

// POST request for editing a benefit
router.post('/edit', asyncHandler(async (req, res) => {
    const { id, name, description, quantity, date_received, benefactor } = req.body;

    console.log("Received data:", req.body);

    if (!id || !name || !description || !quantity || !date_received || !benefactor) {
        console.log("Missing fields:", req.body);
        return res.status(400).json({ message: "All fields are required" });
    }

    const updateData = {
        name: name,
        description: description,
        quantity: quantity,
        date_received: new Date(date_received), // Assuming dateReceived is in ISO string format
        benefactor: benefactor
    };

    try {
        const result = await Benefit.updateOne({ _id: id }, updateData);

        if (result.nModified === 0) {
            console.log("No changes made or benefit not found:", id);
            return res.status(404).json({ message: "Benefit not found or no changes made" });
        }

        console.log("Benefit updated successfully:", id);
        res.sendStatus(200);
    } catch (error) {
        console.error("Error updating benefit: haha", error);
        res.status(500).json({ message: "Internal server error" });

    }
}));



// POST request for deleting item
router.post('/delete', asyncHandler(async (req, res, next) => {
    //Check first if there are beneficiaries with the current benefit. If there are, it cannot be deleted.
    
    await Benefit.deleteOne({_id: req.body.benefit_id});
    console.log("Benefit ID " + req.body.benefit_id + " has been deleted.");
    res.sendStatus(200);
}));

// GET request for one item.
router.get('/:id', asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item detail");
}));

module.exports = router;