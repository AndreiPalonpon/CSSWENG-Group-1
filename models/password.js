const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PasswordSchema = new Schema({
    password: String,
});

module.exports = mongoose.model("Password", PasswordSchema, 'passwords');