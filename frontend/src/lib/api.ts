import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchQuestions = () => axios.get(`${API_BASE}/questions`);
export const saveQuestion = (question) => axios.post(`${API_BASE}/questions`, question);
