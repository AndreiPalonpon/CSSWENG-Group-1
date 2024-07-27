const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProgramSchema = new Schema({
    name: { type: String, required: true },
    recent_update_date: { type: Date, default: Date.now },
    creation_date: { type: Date, default: Date.now },
    program_type: {
        type: String,
        required: true,
        enum: ["Assistance", "Initiative", "Service", "Program",],
        default: "Program"
    },
    frequency: {
        type: String,
        required: true,
        enum: ["Monthly", "Quarterly", "Semi-Annual", "Yearly",]
    },
    assistance_type: {
        type: String,
        required: true,
        enum: ["Educational", "Financial", "Medical",]
    },
});

ProgramSchema.virtual("code_matched").get(function () {
    const code = this.pwd_card_id_no.slice(0, 3);
    //console.log(barangayCodes[code], this.barangay); For debugging...

    return (barangayCodes[code] === this.barangay) ?
            true : false;
});

module.exports = mongoose.model("Program", ProgramSchema, 'programs');