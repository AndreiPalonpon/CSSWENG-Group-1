const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BeneficiarySchema = new Schema({
    person_registered: {
        type: Schema.Types.ObjectId, 
        ref: "Person",
        required: true,
    },
    program_enrolled: {
        type: Schema.Types.ObjectId, 
        ref: "Program",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["", "", "", "",],
    },
    benefit_delivered: {
        type: Schema.Types.ObjectId, 
        ref: "Benefit",
        required: true,
    },
    date_received: { type: Date, required: true },
});

module.exports = mongoose.model("Beneficiary", BeneficiarySchema, "beneficiaries");