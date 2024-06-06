const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProgramSchema = new Schema({
    name: String,
    recent_update_date: { 
        type: Date,
        default: Date.now
    },
    creation_date: { 
        type: Date ,
        default: Date.now
    },
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

module.exports = mongoose.model("Program", ProgramSchema, 'programs');