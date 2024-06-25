const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Renamed to Person?
const PeopleSchema = new Schema({
    name: String,
    dateJoined: Date,
    beneficiaryStatus: {
        type: String,
        required: true,
        enum: ["Active", "Dropped"]
    },
    benefitRequested: {
        type: String,
        required: true,
        enum: ["Educational", "Financial", "Medical",]
    },
    benefitReceived:{
        type: String,
        required: true,
        enum: ["Educational", "Financial", "Medical",]
    },
    dateReceived: Date,

    //Add virtual method for date format.
});

module.exports = mongoose.model("People", PeopleSchema, 'people');