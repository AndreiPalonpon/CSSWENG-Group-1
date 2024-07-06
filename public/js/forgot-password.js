const Question = require('../models/Question');

// Controller function to handle POST request from forgot password form
exports.submitAnswers = async (req, res) => {
    const { answer1, answer2, answer3 } = req.body;

    try {
        // Fetch questions from database
        const questions = await Question.find();

        // Check answers
        const correctAnswers = questions.map(question => question.answer);
        const providedAnswers = [answer1, answer2, answer3];

        // Compare provided answers with correct answers
        const answersMatch = correctAnswers.every((answer, index) => answer === providedAnswers[index]);

        if (answersMatch) {
            // Answers are correct, handle password reset logic here
            res.send('Answers are correct! Handle password reset logic here.');
        } else {
            // Answers do not match
            res.status(400).send('Answers provided are incorrect.');
        }
    } catch (error) {
        console.error('Error retrieving questions or checking answers:', error);
        res.status(500).send('Error retrieving questions or checking answers.');
    }
};
