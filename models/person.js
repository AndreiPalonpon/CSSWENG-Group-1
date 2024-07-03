const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    gender: { 
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"],
    },
    birthdate: { type: Date, required: true },
    address: { type: String, required: true },
    barangay: { type: String, required: true },
    contact_number: { type: String, required: true },
    disability_type: {
        type: String,
        required: true,
        enum: ["Physical", "Sensory", "Intellectual", "Mental",]
    },
    disability: { type: String, required: true },
    pwd_card_id_no: { type: Number, required: true },
    recent_pwd_id_update_date: {
        type: Date,
        required: true,
    }
});

//Virtual method for a person's full name.
PersonSchema.virtual("name").get(function () {
    return `${this.last_name}, ${this.first_name}`;
});

//Virtual method for a person's age.
PersonSchema.virtual("age").get(function () {
    const currentDate = new Date();
    const ageInMilliSecs = currentDate - this.birthdate;
    const ageInDate = new Date(ageInMilliSecs);

    return Math.abs(ageInDate.getUTCFullYear() - 1970);
});

//Virtual method for whether a pwd_id_expired
PersonSchema.virtual("pwd_id_expired").get(function () {
    //Recent update date for the pwd id.
    const recent_update_date = this.recent_pwd_id_update_date; 
    const currentDate = new Date();
    const lenMilliSecs = currentDate - recent_update_date; //length in Millisecs.
    const lenYears = lenMilliSecs / (1000 * 60 * 60 * 24 * 365.25)

    return (lenYears >= 3.0) ? true : false;
});

module.exports = mongoose.model("Person", PersonSchema, 'people');