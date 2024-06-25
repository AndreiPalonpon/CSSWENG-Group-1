const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContributionSchema = new Schema({
    name: { type: String, required: false},
    description: {
        type: String,
        required: false,
    },
    date_received: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model("Contribution", ContributionSchema, "contributions");