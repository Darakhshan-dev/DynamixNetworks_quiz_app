require('dotenv').config();
const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post('/generate', async (req, res) => {
  const { subject, difficulty, numQuestions = 5, prompt } = req.body;

  if ((!prompt || !prompt.trim()) && (!subject || !difficulty)) {
    return res.status(400).json({ error: 'Provide either a custom prompt or both subject and difficulty.' });
  }

  const finalPrompt =
    prompt && prompt.trim().length > 0
      ? `Return ONLY a JSON array as response. ${prompt}`
      : `Generate ${Number(numQuestions) || 5} multiple choice questions about "${subject}" with difficulty "${difficulty}". Each should have 4 options and mark the correct answer. Return ONLY a JSON array of objects like:
[{"question": "...", "options": ["..."], "correctAnswer": 2 }]. Do NOT include any explanation or markdown.`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",   // free model on Groq
      messages: [
        {
          role: "user",
          content: finalPrompt,
        },
      ],
      temperature: 0.7,
    });

    // Extract text from Groq response
    let text = response.choices[0]?.message?.content || '';
    text = text.trim();

    // Strip markdown code fences (``` or ```json etc.)
    text = text.replace(/^```[^\n]*\n?/, '').replace(/```$/, '').trim();

    // Attempt to parse JSON
    try {
      const questionsArr = JSON.parse(text);
      if (!Array.isArray(questionsArr)) {
        throw new Error('Parsed payload is not an array');
      }
      return res.json(questionsArr);
    } catch (parseErr) {
      return res.status(200).json({ error: "Groq did not return valid JSON.", raw: text });
    }
  } catch (error) {
    return res.status(500).json({ error: error?.message || String(error) });
  }
});

module.exports = router;