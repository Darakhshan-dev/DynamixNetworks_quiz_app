import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;
export { API_BASE };

export const fetchQuestions = () => axios.get(`${API_BASE}/questions`);
export const saveQuestion = (question) => axios.post(`${API_BASE}/questions`, question);
