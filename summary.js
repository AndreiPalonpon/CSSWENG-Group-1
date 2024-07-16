const mongoose = require("mongoose");

const mongoDB = "mongodb+srv://andreipalonpon:Ftlpn7UeDQfci6uG@appcluster.00tewof.mongodb.net/main?retryWrites=true&w=majority&appName=AppCluster";
mongoose.connect(mongoDB);

const Program = require("./models/program");
const Person = require("./models/person");
const Beneficiary = require("./models/beneficiary");
const Benefactor = require("./models/benefactor");
const Benefit = require("./models/benefit");
const Documentation = require("./models/documentation");