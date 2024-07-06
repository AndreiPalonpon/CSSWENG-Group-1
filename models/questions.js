const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    question: String,
    answer: String
});

module.exports = mongoose.model("Question", QuestionSchema, 'questions');