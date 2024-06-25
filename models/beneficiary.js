const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BeneficiaryScheme = new Schema({
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    date_of_birth: { 
        type: Date,
        required: true,
    },
    gender: { 
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"],
    },
    contact_number: {
        type: String,
        required: true,
    },
    barangay: {
        type: String,
        required: true,
    },
    disability_type: {
        type: String,
        required: true,
        enum: ["Physical", "Sensory", "Intellectual", "Mental",]
    },
    comorbidities: {
        type: String,
        required: true,
        enum: ["None", "Diabetes", "Hypertension", "Heart Disease", "Other",]
    },
    pwd_card_id: {
        type: Number,
        required: true
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

module.exports = mongoose.model("Beneficiary", BeneficiaryScheme, "beneficiaries");