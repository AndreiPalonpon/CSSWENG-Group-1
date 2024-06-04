const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BeneficiaryScheme = new Schema({
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    date: { //Ambiguous.
        type: Date,
        required: true,
        default: Date.now,
    },
    gender: { 
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"],
    },
    location: {
        type: String,
        required: true,
    },
    disability_type: {
        type: String,
        required: true,
        enum: ["Disability 1", "Quarterly", "Semi-Annual", "Yearly",]
    },
    assistance_type: {
        type: String,
        required: true,
        enum: ["Educational", "Financial", "Medical",]
    },
    frequency: {
        type: String,
        required: true,
        enum: ["Quarterly", "Semi-Annually", "Yearly",]
    },
    status: {
        type: String,
        required: true,
        enum: ["Approved", "Pending", "Denied",]
    }
});

//Virtual method for a beneficiary's full name.
BeneficiaryScheme.virtual("name").get(function () {
    let fullName = "";
    if (this.first_name && this.last_name) {
      fullname = `${this.last_name}, ${this.first_name}`;
    }
  
    return fullName;
});

module.exports = mongoose.model("Beneficiary", BeneficiaryScheme);