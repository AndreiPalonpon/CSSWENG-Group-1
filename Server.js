const createError = require('http-errors');
const path = require("path");
const express = require("express");

//Connecting to MongoDB.
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
//mongoose.connect() //Connect.

const Program = require("./models/program");
const Beneficiary = require("./models/beneficiary");
const Benefactor = require("./models/benefactor");
const Inventory = require("./models/inventory");

const programsRouter = require("./routes/programs");
const beneficiaryRouter = require("./routes/beneficiaries");
const benefactorRouter = require("./routes/programs");
const inventoryRouter = require("./routes/programs");

const app = new express();
app.use(express.json());
app.use(express.urlencoded( {extended: true})); 
app.use(express.static(__dirname + '/public'));

//Setting up routers.
app.use("/programs", programsRouter);
app.use("/beneficiaries", beneficiaryRouter);
app.use("/benefactors", benefactorRouter);
app.use("/inventory", inventoryRouter);

const hbs = require("hbs");
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

hbs.registerHelper('toString', function(objectId) {
    return objectId.toString();
});

app.use(function(req, res, next) {
    next(createError(404));
});

const server = app.listen(3000, function() {
    console.log("Running at Node 3000");
});

module.exports = app;