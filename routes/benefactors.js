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
router.get('/', asyncHandler(async (req, res) => {
    const benefactors = await Benefactor.find().sort({ name: 1 }).exec();
    console.log(benefactors);
    res.render("benefactor-list", { benefactors });
}));

// POST request for creating benefactor
router.post('/create', asyncHandler(async (req, res) => {
    const { benefactorName, benefactorType } = req.body;

    const newBenefactor = new Benefactor({
        name: benefactorName,
        type: benefactorType,
    });

    console.log(newBenefactor);

    await newBenefactor.save();

    console.log("New benefactor instance saved.");
    res.sendStatus(201); // HTTP 201: Created
}));

// POST request for editing benefactor
router.post('/edit', asyncHandler(async (req, res) => {
    const { benefactor_id, benefactor_name, benefactor_type } = req.body;

    console.log("Received data:", req.body);

    if (!benefactor_id || !benefactor_name || !benefactor_type) {
        console.log("Missing fields:", req.body);
        return res.status(400).json({ message: "All fields are required" });
    }

    const updateData = {
        name: benefactor_name,
        type: benefactor_type
    };

    try {
        const result = await Benefactor.updateOne({ _id: benefactor_id }, updateData);

        if (result.nModified === 0) {
            console.log("No changes made or benefactor not found:", benefactor_id);
            return res.status(404).json({ message: "Benefactor not found or no changes made" });
        }

        console.log("Benefactor updated successfully:", benefactor_id);
        res.sendStatus(200); // HTTP 200: OK
    } catch (error) {
        console.error("Error updating benefactor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));

// POST request for deleting benefactor
router.post('/delete', asyncHandler(async (req, res) => {
    // Check first if there are benefits from the current benefactor. If there are, he or she cannot be deleted.
    await Benefactor.deleteOne({ _id: req.body.benefactor_id });
    console.log(`Benefactor ID ${req.body.benefactor_id} has been deleted.`);
    res.sendStatus(200); // HTTP 200: OK
}));

// GET request for one benefactor
router.get('/:id', asyncHandler(async (req, res) => {
    res.send("NOT IMPLEMENTED: Benefactor detail");
}));

module.exports = router;
