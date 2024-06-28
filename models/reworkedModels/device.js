const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
    name: { type: String, required: false },
    description: { type: String, required: false },
    date_received: { type: Date, required: true }, 
    sponsor: { type: String, required: true },
    
    /*sponsor: {
        type: Schema.Types.ObjectId, 
        ref: "Sponsor",
        required: false, //switch to true
    },
    */
});

module.exports = mongoose.model("Device", DeviceSchema, "devices");