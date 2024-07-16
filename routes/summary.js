const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const json = require("json");

const Program = require("./models/program");
const Person = require("./models/person");
const Beneficiary = require("./models/beneficiary");
const Benefactor = require("./models/benefactor");
const Benefit = require("./models/benefit");
const Documentation = require("./models/documentation");

// Get request for summary.
router.get('/', asyncHandler(async (req, res) => {
    const programs = await Program.find().sort({ name: 1 }).exec();
    res.render("program-list", { programs });
}));
