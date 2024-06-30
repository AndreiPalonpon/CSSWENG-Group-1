const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DocumentationSchema = new Schema({
    //photos: 
    documentation: { type: String, required: true },
    assigned_program: {
        type: Schema.Types.ObjectId, 
        ref: "Program",
        required: true,
    },
});

module.exports = mongoose.model("Documentation", DocumentationSchema, "documentations");