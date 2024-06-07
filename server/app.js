// /api/chat.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { v4: uuidv4 } = require('uuid');

// Configura aquí tu instancia de AI y cualquier configuración global.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const systemInstruction = 'Eres un experto en plantas...';

// Supongamos que manejas las sesiones de chat aquí.
let sessions = {};

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

module.exports = async (req, res) => {
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
};
