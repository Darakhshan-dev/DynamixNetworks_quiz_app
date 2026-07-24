# Quiz App

A full-stack quiz application with AI-powered question generation, built with the MERN stack (MongoDB, Express, React, Node.js) and Groq AI integration.

## 🌐 Live Demo

- **Frontend:** [Your Vercel URL here]
- **Backend API:** [Your Render URL here]

## ✨ Features

- **Take Quizzes** — Select a subject and difficulty level, then answer multiple-choice questions with instant scoring
- **Admin Panel** — Add, view, and delete quiz questions manually
- **AI Question Generator** — Generate quiz questions automatically using Groq AI and also add it manually based on subject, difficulty.
- **AI Review Flow** — Review and select AI-generated questions before saving them to the database
- **Category & Difficulty Filtering** — Questions are organized by subject and difficulty (easy / medium / hard)

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Axios for API requests
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- Groq AI SDK for question generation

**Deployment**
- Frontend: [Vercel]https://dynamix-networks-quiz-app-xi.vercel.app/
- Backend: [Render]https://dynamixnetworks-quiz-app-1.onrender.com

## 📁 Project Structure

```
DynamixNetworks_quiz_app/
├── backend/
│   ├── routes/
│   │   ├── questions.js      # CRUD routes for quiz questions
│   │   └── gemini.js         # Groq AI question generation route
│   └── server.js             # Express app entry point
└── frontend/
    └── src/
        ├── components/       # Reusable UI components
        ├── pages/            # Route-level pages (Admin, Quiz, UserSelect, etc.)
        └── lib/
            └── api.ts        # Central API base URL config
```

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18 or higher recommended)
- A MongoDB connection string (local or MongoDB Atlas)
- A Groq API key ([console.groq.com](https://console.groq.com))

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

Run the backend:
```bash
node server.js
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5000
```

Run the frontend:
```bash
npm run dev
```

## 🔑 Environment Variables

| Variable | Location | Description |
|---|---|---|
| `MONGODB_URI` | Backend | MongoDB Atlas connection string |
| `GROQ_API_KEY` | Backend | API key for Groq AI question generation |
| `PORT` | Backend | Port the server runs on (defaults to 5000) |
| `VITE_API_URL` | Frontend | Base URL of the deployed/local backend |
