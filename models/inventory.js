const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InventorySchema = new Schema({ 
    //To be implemented.
});

module.exports = mongoose.model("Inventory", InventorySchema, "inventories");
