const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
const createError = require('http-errors');
const path = require("path");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const moment = require('moment');
const hbs = require("hbs");

const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const forgotPasswordRouter = require("./routes/forgot-password");
const resetPasswordRouter = require("./routes/reset-password");
const programsRouter = require("./routes/programs");
const beneficiaryRouter = require("./routes/beneficiaries");
const benefactorRouter = require("./routes/benefactors");
const benefitRouter = require("./routes/benefits");
const peopleRouter = require("./routes/people");
const documentationRouter = require("./routes/documentation");
const settingsRouter = require("./routes/settings");
const changePasswordRouter = require("./routes/change-password");
const securityQuestionRouter = require("./routes/security-questions");
const aboutRouter = require("./routes/about");
const contactRouter = require("./routes/contact");

const Program = require("./models/program");
const Person = require("./models/person");
const Beneficiary = require("./models/beneficiary");
const Benefactor = require("./models/benefactor");
const Benefit = require("./models/benefit");
const Documentation = require("./models/documentation");

const app = express();
const mongoDB = "mongodb+srv://andreipalonpon:Ftlpn7UeDQfci6uG@appcluster.00tewof.mongodb.net/main?retryWrites=true&w=majority&appName=AppCluster";

async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => console.log(err));

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// View engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Register handlebars helpers
hbs.registerHelper('toString', function (objectId) {
  return objectId.toString();
});

hbs.registerHelper('incremented', function (index) {
  index++;
  return index;
});

hbs.registerHelper('formatDate', function (date) {
  return moment(date).format('MM-DD-YYYY');
});

// Routers setup
app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/forgot-password", forgotPasswordRouter);
app.use("/reset-password", resetPasswordRouter);
app.use("/programs", programsRouter);
app.use("/beneficiaries", beneficiaryRouter);
app.use("/benefactors", benefactorRouter);
app.use("/benefits", benefitRouter);
app.use("/people", peopleRouter);
app.use("/documentation", documentationRouter);
app.use("/settings", settingsRouter);
app.use("/change-password", changePasswordRouter);
app.use("/security-question", securityQuestionRouter);
app.use("/about", aboutRouter);
app.use("/contact", contactRouter);

// 404 error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Start the server
const server = app.listen(3000, function () {
  console.log("Running at Node 3000");
});

module.exports = app;
