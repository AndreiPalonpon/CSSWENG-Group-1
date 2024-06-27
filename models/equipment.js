const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EquipmentSchema = new Schema({
    item_name: { type: String, required: true },
    item_desc: { type: String, required: true },
    date_received: { type: String, required: true },
});

module.exports = mongoose.model("Equipment", EquipmentSchema, "equipment");
