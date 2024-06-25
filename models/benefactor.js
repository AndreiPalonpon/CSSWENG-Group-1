const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BenefactorSchema = new Schema({
    name: { type: String, required: true, },
    type: {
        type: String,
        required: true,
        enum: ["", "", "", "",],
        default: "Benefactor"
    },
    //contribution: { type: Contribution, required: true, }, To be implemented.
});

module.exports = mongoose.model("Benefactor", BenefactorSchema, "benefactors");