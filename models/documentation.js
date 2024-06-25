const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DocumentationSchema = new Schema({
    /*
    To be implemented.
    assigned_program: { type: Program, required: true, },
    photos: [ {type: Photo, required: false, } ],
    documentation: { type: String, required: false, },
    */
});

module.exports = mongoose.model("Documentation", DocumentationSchema, "documentations");