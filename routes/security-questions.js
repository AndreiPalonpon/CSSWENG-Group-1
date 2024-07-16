const express = require("express");
const router = express.Router();
const path = require("path");
const Question = require("../models/question");

// Session Authenticator
function requireAuth(req, res, next) {
    console.log("Checking authentication...");
    if (req.session.user && req.session.user.authenticated) {
        console.log("User is authenticated. Proceeding to security questions page...");
        next(); 
    } else {
        console.log("User is not authenticated. Redirecting to login page...");
        res.redirect('/login');
    }
}

// GET request to display security question page
router.get("/", requireAuth, function (req, res) {
    res.sendFile(path.resolve('./views/security-questions.html'));
});

// POST route to save edited security questions
router.post("/", async (req, res, next) => {
    try {
        const { question1, answer1, question2, answer2, question3, answer3 } = req.body;

        // Array to store updates
        const updates = [];

        // Define the questions that can be edited (based on existing IDs or specific questions)
        const editableQuestions = [
            { _id: "668a1ead20da98a24d2d8246", question: question1, answer: answer1 },
            { _id: "668a1edd20da98a24d2d8247", question: question2, answer: answer2 },
            { _id: "668a1efd20da98a24d2d8248", question: question3, answer: answer3 }
        ];

        // Iterate through editable questions and update in database
        for (const q of editableQuestions) {
            const update = await Question.findByIdAndUpdate(q._id, { question: q.question, answer: q.answer }, { new: true });
            updates.push(update);
        }

        console.log("Updated questions:", updates);

        res.redirect("/settings"); // Redirect to settings page after saving
    } catch (err) {
        next(err); // Pass error to Express error handler
    }
});

module.exports = router;
