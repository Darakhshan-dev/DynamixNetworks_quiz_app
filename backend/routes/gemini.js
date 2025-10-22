// ...existing code...
require('dotenv').config();
const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
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
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: finalPrompt,
    });

    // --- EXTRACT TEXT SAFELY FROM RESPONSE ---
    let text = '';
    if (typeof response === 'string') {
      text = response;
    } else if (typeof response.text === 'string') {
      text = response.text;
    } else if (response.output?.[0]?.content?.[0]?.text) {
      text = response.output[0].content[0].text;
    } else if (response.candidates?.[0]?.content) {
      // fallback: join text pieces if present
      const pieces = response.candidates[0].content;
      text = Array.isArray(pieces) ? pieces.map(p => p.text || '').join('') : (pieces.text || '');
    } else {
      text = JSON.stringify(response);
    }

    text = text.trim();

    // --- STRIP MARKDOWN CODE FENCES (supports ``` or ```json etc.) ---
    // remove leading ```[lang]\n and trailing ```
    text = text.replace(/^```[^\n]*\n?/, '').replace(/```$/, '').trim();

    // --- ATTEMPT TO PARSE JSON ---
    try {
      const questionsArr = JSON.parse(text);
      if (!Array.isArray(questionsArr)) {
        throw new Error('Parsed payload is not an array');
      }
      return res.json(questionsArr);
    } catch (parseErr) {
      return res.status(200).json({ error: "Gemini did not return valid JSON.", raw: text });
    }
  } catch (error) {
    return res.status(500).json({ error: error?.message || String(error) });
  }
});

module.exports = router;
// ...existing code...