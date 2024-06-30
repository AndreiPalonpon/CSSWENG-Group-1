const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BenefitSchema = new Schema({
    name: { type: String, required: false },
    description: { type: String, required: false },
    date_received: { type: Date, required: true }, 
    quantity: { type: Number, required: true },
    benefactors: [{
        type: Schema.Types.ObjectId, 
        ref: "Benefactor",
        required: true, 
    }],
});

module.exports = mongoose.model("Benefit", BenefitSchema, "benefits");