const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InventorySchema = new Schema({
    item_name: String,
    item_desc: String,
    date_received: { 
        type: Date,
        default: Date.now
    },
    quantity: Number,
    receiving_program: {
        type: String,
        required: true,
        default: "Program"
    }
});

module.exports = mongoose.model("Inventory", InventorySchema, "inventories");
