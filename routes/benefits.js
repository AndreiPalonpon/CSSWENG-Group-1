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

// GET request to list all benefits with sorting and filtering
router.get('/', asyncHandler(async(req, res) => {
    const { nameSort, quantitySort, dateSort, benefactorFilter, page = 1, limit = 20 } = req.query;

    let sortOptions = {};
    let filterOptions = {};

    if (nameSort) {
        sortOptions['name'] = nameSort === 'az' ? 1 : -1;
    }

    if (quantitySort) {
        sortOptions['quantity'] = quantitySort === 'asc' ? 1 : -1;
    }

    if (dateSort) {
        sortOptions['date_received'] = dateSort === 'newest' ? -1 : 1;
    }

    if (benefactorFilter) {
        filterOptions['benefactor.name'] = { $in: benefactorFilter.split(',') };
    }

    // Logging for debugging
    console.log('Filter Options:', filterOptions);
    console.log('Sort Options:', sortOptions);

    const totalBenefits = await Benefit.countDocuments(filterOptions);
    const benefits = await Benefit.find(filterOptions).populate("benefactor")
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .exec();

    const benefactors = await Benefactor.find().exec();

    console.log('Filtered Benefits:', benefits);

    res.render("benefit-list", {
        benefactors,
        benefits,
        currentPage: page,
        totalPages: Math.ceil(totalBenefits / limit),
        totalBenefits
    });
}));

router.post('/create', asyncHandler(async(req, res, next) => {
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
router.post('/edit', asyncHandler(async(req, res) => {
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
        date_received: new Date(date_received), 
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
router.post('/delete', asyncHandler(async(req, res, next) => {
    //Check first if there are beneficiaries with the current benefit. If there are, it cannot be deleted.

    await Benefit.deleteOne({ _id: req.body.benefit_id });
    console.log("Benefit ID " + req.body.benefit_id + " has been deleted.");
    res.sendStatus(200);
}));

// GET request for one item.
router.get('/:id', asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: Item detail");
}));

module.exports = router;