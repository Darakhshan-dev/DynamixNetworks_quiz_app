import React, { useState } from 'react';
import axios from 'axios';

const AddQuestion = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const questionData = {
        question,
        options,
        correctAnswer,
        category,
        difficulty,
      };
      const response = await axios.post('http://localhost:5000/api/questions', questionData);
      alert('Question added successfully');
      // Clear form
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer(0);
      setCategory('');
      setDifficulty('');
    } catch (error) {
      alert('Failed to add question');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Question</h2>

      <label>Question:</label>
      <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required />

      <label>Options:</label>
      {options.map((opt, i) => (
        <input
          key={i}
          type="text"
          value={opt}
          onChange={(e) => handleOptionChange(i, e.target.value)}
          required
        />
      ))}

      <label>Correct Option (Index 0-3):</label>
      <input
        type="number"
        value={correctAnswer}
        min="0"
        max="3"
        onChange={(e) => setCorrectAnswer(parseInt(e.target.value))}
        required
      />

      <label>Category:</label>
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />

      <label>Difficulty:</label>
      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
        <option value="">Select Difficulty</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <button type="submit">Add Question</button>
    </form>
  );
};

export default AddQuestion;
