import { h } from 'preact';
import { useState } from 'preact/hooks';
import axios from 'axios';
import './app.css';
import { v4 as uuidv4 } from 'uuid';
export function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const sessionId = uuidv4(); // Asegúrate de que uuidv4 esté importado

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    try {
      const response = await axios.post('/api/chat', {
        sessionId,
        message: inputText,
      });
      setMessages([
        ...messages,
        { text: inputText, aiText: response.data.message },
      ]);
      setInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleInputChange = (e) => setInputText(e.target.value);

  return (
    <div className="chat-container">
      <h1>Chat with AI</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>User:</strong> {msg.text}
            <br />
            <strong>AI:</strong> {msg.aiText}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
