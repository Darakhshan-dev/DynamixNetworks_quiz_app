const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }], // array of answer choices
  correctAnswer: { type: Number, required: true }, // index of correct option
  category: { type: String, required: true },     // "Math", "GK", "Physics", etc.
  difficulty: { type: String, required: true },   // "Easy", "Medium", "Hard"
}); 

module.exports = mongoose.model("Question", QuestionSchema);
