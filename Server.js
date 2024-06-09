const createError = require('http-errors');
const express = require("express");

//Connecting to MongoDB.
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = "mongodb+srv://andreipalonpon:Ftlpn7UeDQfci6uG@appcluster.00tewof.mongodb.net/?retryWrites=true&w=majority&appName=AppCluster";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const path = require("path");
const cookieParser = require('cookie-parser');
const logger = require('morgan')

const Program = require("./models/program");
const Beneficiary = require("./models/beneficiary");
const Benefactor = require("./models/benefactor");
const Inventory = require("./models/inventory");

const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login")
const programsRouter = require("./routes/programs");
const beneficiaryRouter = require("./routes/beneficiaries");
const benefactorRouter = require("./routes/programs");
const inventoryRouter = require("./routes/programs");
const peopleRouter = require("./routes/people");

const app = new express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded( {extended: true}));
app.use(cookieParser()); 
app.use(express.static(__dirname + '/public'));

//Setting up routers.
app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/programs", programsRouter);
app.use("/beneficiaries", beneficiaryRouter);
app.use("/benefactors", benefactorRouter);
app.use("/inventory", inventoryRouter);
app.use("/people", peopleRouter);

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