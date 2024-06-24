const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BenefactorScheme = new Schema({
    benefactor_name: String,
    benefactor_type: {
        type: String,
        required: true,
        enum: ["", "", "", "",],
        default: "Benefactor"
    },
    benefactor_contribution: String,
    programs_helped: String,
});

module.exports = mongoose.model("Benefactor", BenefactorScheme, "benefactors");