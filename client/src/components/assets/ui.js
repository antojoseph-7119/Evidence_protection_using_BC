import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, Send, MessageCircle } from "lucide-react";

const VerifyFileChatSection = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Predefined Q&A for the chatbot
  const suggestions = [
    "What does this system do?",
    "How do I verify my file?",
    "What if my file is tampered with?",
    "What should I do with the certificate key?",
    "Is my file stored on the blockchain?"
  ];

  const botResponses = {
    "What does this system do?": "It lets you upload a file to the blockchain and get a unique certificate key. Later, you can verify if the file is original or tampered.",
    "How do I verify my file?": "Upload the file and enter the certificate key. The system will check if the file is unchanged or corrupted.",
    "What if my file is tampered with?": "The system will alert you that the file doesn't match the original and may be corrupted.",
    "What should I do with the certificate key?": "Keep it safe! Without it, you cannot verify your file later.",
    "Is my file stored on the blockchain?": "No, only a digital fingerprint (hash) of the file is stored for verification.",
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = (text) => {
    setIsTyping(true);
    const typingTime = Math.min(1000 + text.length * 20, 3000); // Adjust typing speed based on message length
    
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsTyping(false);
        resolve();
      }, typingTime);
    });
  };

  const handleSendMessage = async (text) => {
    const userMessage = text || inputMessage.trim();
    if (userMessage) {
      // Add user message
      setMessages(prev => [...prev, { id: Date.now(), sender: "user", text: userMessage }]);
      setInputMessage("");

      // Simulate bot typing and response
      await simulateTyping(botResponses[userMessage] || "I'm thinking...");
      
      const botResponse = botResponses[userMessage] || 
        "I'm sorry, I don't understand that question. Feel free to try one of the suggested questions below.";
      
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: "bot", text: botResponse }]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="chatbot-ui" style={{
      width: '50%',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(37, 99, 235, 0.1)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
    }}>
      <div className="chatbot-header" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '1.5rem',
      }}>
        <ShieldCheck size={30} color="#2563EB" />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1E3A8A' }}>Verification Guide</h2>
      </div>

      <div className="chatbot-messages" style={{
        flex: '1',
        overflowY: 'auto',
        marginBottom: '1rem',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: '#F9FAFB',
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '1rem',
            }}
          >
            <div style={{
              maxWidth: '80%',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: message.sender === 'user' ? '#2563EB' : '#E5E7EB',
              color: message.sender === 'user' ? 'white' : 'black',
            }}>
              {message.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            backgroundColor: '#E5E7EB',
            width: 'fit-content',
            marginBottom: '1rem',
          }}>
            <MessageCircle size={16} />
            <div className="typing-indicator" style={{
              display: 'flex',
              gap: '4px',
            }}>
              <div className="dot" style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#4B5563',
                borderRadius: '50%',
                animation: 'typing 1.4s infinite',
                animationDelay: '0s',
              }} />
              <div className="dot" style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#4B5563',
                borderRadius: '50%',
                animation: 'typing 1.4s infinite',
                animationDelay: '0.2s',
              }} />
              <div className="dot" style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#4B5563',
                borderRadius: '50%',
                animation: 'typing 1.4s infinite',
                animationDelay: '0.4s',
              }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="suggestions" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '1rem',
      }}>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#EEF2FF',
              border: '1px solid #E5E7EB',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#2563EB',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#2563EB';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#EEF2FF';
              e.currentTarget.style.color = '#2563EB';
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="chatbot-input"
        style={{ display: 'flex', gap: '10px' }}
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          style={{
            flex: '1',
            padding: '0.75rem',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          <Send size={18} />
        </button>
      </form>

      <style>
        {`
          @keyframes typing {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          .typing-indicator .dot {
            animation: typing 1.4s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default VerifyFileChatSection;