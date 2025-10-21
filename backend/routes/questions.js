const express = require('express');
const router = express.Router();
const Question = require('../models/Question'); // Import your Mongoose model

// CREATE a new question
router.post('/', async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ: Get all questions (with filter support)
router.get('/', async (req, res) => {
  const { category, difficulty } = req.query;
  const query = {};
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  try {
    const questions = await Question.find(query);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a question by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a question by ID
router.delete('/:id', async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET all unique categories (for dropdown)
router.get('/categories', async (req, res) => {
  try {
    const categories = await Question.distinct("category"); // use "category" or "subject" depending on schema
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
