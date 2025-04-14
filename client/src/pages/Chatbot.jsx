import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  useEffect(() => {
    const welcomeMessage = {
      role: 'assistant',
      text: "Hello. I'm your EcoGuide, a waste management expert here to help you with recycling, proper waste disposal, and environmental sustainability. What's on your mind? Do you have a specific question or concern about reducing your environmental footprint?"
    };
    setConversation([welcomeMessage]);
  }, []);
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const userMessage = { role: 'user', text: message };
    setConversation((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post('http://localhost:5001/chat', { message }, {
        headers: { 'Content-Type': 'application/json' }
      });
      const assistantMessage = { role: 'assistant', text: response.data.response };
      setConversation((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { role: 'assistant', text: 'Sorry, an error occurred.' };
      setConversation((prev) => [...prev, errorMessage]);
    }
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full font-sans bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 shadow-md">
        <h1 className="text-base font-semibold">♻️ WasteWise EcoGuide</h1>
        <p className="text-xs text-green-100">
          Ask anything about waste disposal, recycling, or sustainability.
        </p>
      </div>
  
      {/* Chat window */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs px-4 py-3 rounded-lg shadow text-sm whitespace-pre-line ${
              msg.role === 'user'
                ? 'ml-auto bg-green-100 text-gray-800'
                : 'mr-auto bg-white text-gray-900 border border-green-200'
            }`}
          >
            <strong className="block mb-1 text-xs text-gray-500">
              {msg.role === 'user' ? 'You' : 'EcoGuide'}
            </strong>
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
      </div>
  
      {/* Input bar (sticky) */}
      <form
        onSubmit={sendMessage}
        className="flex items-center bg-white px-3 py-2 border-t border-gray-200"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask your question..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium"
        >
          Send
        </button>
      </form>
    </div>
  );
  
  
};

export default Chatbot;