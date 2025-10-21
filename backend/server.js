const express = require('express');
const mongoose = require('mongoose');
const questionRoutes = require('./routes/questions');

const app = express();
app.use(express.json());

const cors = require('cors');
// Use CORS middleware early, before defining routes
app.use(cors());

app.use('/api/questions', questionRoutes);


app.get('/', (req, res) => {
  res.send('Backend is running');
});


mongoose.connect('mongodb://localhost:27017/quizapp');


mongoose.connection.on('connected', () => {
  console.log('MongoDB is connected');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
