const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BenefactorSchema = new Schema({
    name: { type: String, required: true, },
    type: {
        type: String,
        required: true,
        enum: ["Type1", "Type2", "Type3", "Type4"],
    },
});

module.exports = mongoose.model("Benefactor", BenefactorSchema, "benefactors");