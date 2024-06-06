const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InventoryScheme = new Schema({
    
});

module.exports = mongoose.model("Inventory", InventoryScheme, "inventories");
