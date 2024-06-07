require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const sessions = {};
const systemInstruction = 'Eres un experto en plantas...';

// Generar modelo de AI para cada nueva sesión
const getModel = (sessionId) => {
  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      model: genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction,
      }),
      history: [],
    };
  }
  return sessions[sessionId].model;
};

app.post('/api/chat', async (req, res) => {
  const { sessionId, message } = req.body;
  if (!sessionId || !message) {
    return res
      .status(400)
      .json({ error: 'Se requiere el ID de la sesión y un mensaje.' });
  }

  const model = getModel(sessionId);

  try {
    const result = await model.sendMessage({
      message,
      history: sessions[sessionId].history,
    });
    const aiMessage = result.text;

    sessions[sessionId].history.push({ role: 'user', text: message });
    sessions[sessionId].history.push({ role: 'model', text: aiMessage });

    res.json({ message: aiMessage });
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    res.status(500).json({ error: 'Error al enviar el mensaje.' });
  }
});

app.use('/uploads', express.static('uploads'));
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
