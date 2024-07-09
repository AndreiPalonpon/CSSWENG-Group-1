const express = require("express");
const router = express.Router();
const Question = require("../models/question");

// GET route for forgot password page
router.get("/", async (req, res, next) => {
    try {
        const questions = await Question.find({}, 'question');
        res.render("forgot-password", { questions });
    } catch (err) {
        next(err);
    }
});

// POST route for submitting answers
router.post("/", async (req, res, next) => {
    try {
        const inputs = req.body; 
        const questions = await Question.find({}, 'question answer'); 

        let correctAnswers = 0;
        let errors = [];

        questions.forEach((question, index) => {
            const userAnswer = inputs[`answer${index}`]; 
            if (userAnswer) {
                if (userAnswer === question.answer) {
                    correctAnswers++;
                } else {
                    errors.push(`Answer for '${question.question}' is incorrect.`);
                }
            } else {
                errors.push(`Answer for '${question.question}' is missing.`);
            }
        });

        if (correctAnswers === questions.length) {
            req.session.forgotPasswordCompleted = true; 
            res.json({ allCorrect: true });
        } else {
            res.status(400).json({ allCorrect: false, errors });
        }
    } catch (err) {
        console.error('Error submitting answers:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
