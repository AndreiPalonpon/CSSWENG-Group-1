const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PasswordSchema = new Schema({
    password: { type: String, required: true }
});

module.exports = mongoose.model("Password", PasswordSchema, 'passwords');
