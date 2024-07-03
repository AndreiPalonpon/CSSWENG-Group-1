const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const barangayCodes = {
        "001": "Almanza Uno",
        "002": "Daniel Fajardo",
        "003": "Elias Aldana",
        "004": "Ilaya",
        "005": "Manuyo Uno",
        "006": "Pamplona Uno",
        "007": "Pulanglupa Uno",
        "008": "Talon Uno",
        "009": "Zapote",
        "010": "Almanza Dos",
        "011": "BF International/CAA",
        "012": "Manuyo Dos",
        "013": "Pamplona Dos",
        "014": "Pamplona Tres",
        "015": "Pilar",
        "016": "Pulanglupa Dos",
        "017": "Talon Dos",
        "018": "Talon Tres",
        "019": "Talos Kuartro",
        "020": "Talon Singko"
    };

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
    barangay: { 
        type: String, 
        required: true,
        enum: Object.values(barangayCodes),
    },
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

PersonSchema.virtual("code_matched").get(function () {
    const code = this.pwd_card_id_no.slice(0, 3);
    return (barangayCodes[code] === this.barangay) ?
            true : false;
});

module.exports = mongoose.model("Person", PersonSchema, 'people');