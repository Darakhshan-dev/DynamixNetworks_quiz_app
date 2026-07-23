import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../services/api';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios.get(`${API_BASE}/questions`);
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
    fetchQuestions();
  }, []);

  return (
    <div>
      <h2>Questions List</h2>
      <ul>
        {questions.map((q) => (
          <li key={q._id}>
            <strong>{q.question}</strong> | Category: {q.category} | Difficulty: {q.difficulty}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionList;
