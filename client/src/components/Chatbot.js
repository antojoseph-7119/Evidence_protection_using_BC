import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, Send, MessageCircle, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

const VerifyFileChatSection = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false); // Logout confirmation state
  const logoutPendingRef = useRef(false); // To prevent multiple logout attempts

  const navigate = useNavigate();

  // Logout handler
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        console.log("Logged out successfully");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("loginTime");
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      logoutPendingRef.current = false; // Reset after the request completes
    }
  };

  const handleLogoutClick = () => {
    if (!logoutPendingRef.current) {
      setShowLogoutConfirmation(true);
    }
  };

  const handleConfirmLogout = () => {
    if (!logoutPendingRef.current) {
      logoutPendingRef.current = true; // Prevent multiple calls during the asynchronous operation
      setShowLogoutConfirmation(false);
      handleLogout(); // Call handleLogout
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirmation(false);
    logoutPendingRef.current = false; // Reset in case the dialog was showing
  };

  const styles = {
    container: {
      height: '100vh',
      background: 'linear-gradient(135deg, #F9FAFB 0%, #EEF2FF 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    header: {
      position: 'fixed',
      top: 0,
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      padding: '1rem 5%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 50
    },
    headerLogo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontWeight: 'bold',
      fontSize: '1.25rem',
      color: '#1E3A8A'
    },
    headerNav: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem'
    },
    headerLink: {
      textDecoration: 'none',
      color: '#1E3A8A',
      fontWeight: '500',
      transition: 'all 0.2s',
      position: 'relative'
    },
    headerButton: {
      backgroundColor: '#2563EB',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'all 0.2s',
      boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)'
    },
    mainContent: {
      padding: '7rem 5% 3rem',
      width: '100%',
      height: 'calc(100vh - 10rem)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    flex: {
      display: 'flex',
      gap: '3rem',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%',
      height: '100%',
      alignItems: 'center',
    },
    chatSection: {
      width: '50%',
      backgroundColor: 'white',
      borderRadius: '1.5rem',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      maxHeight: '80vh',
      position: 'relative',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      overflow: 'hidden',
    },
    chatHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      borderBottom: '2px solid #EEF2FF',
      paddingBottom: '1rem',
      marginBottom: '1rem',
    },
    chatTitle: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    chatMessages: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#F8FAFC',
      borderRadius: '1rem',
      overflowY: 'auto',
      marginBottom: '1rem',
      scrollBehavior: 'smooth',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
    },
    message: {
      maxWidth: '80%',
      padding: '1rem 1.25rem',
      borderRadius: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      animation: 'messageSlide 0.3s ease-out',
      wordBreak: 'break-word',
      position: 'relative',
    },
    userMessage: {
      marginLeft: 'auto',
      background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
      color: 'white',
      borderBottomRightRadius: '0.25rem',
    },
    botMessage: {
      background: 'white',
      color: '#1E293B',
      borderBottomLeftRadius: '0.25rem',
      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    },
    typingIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      borderRadius: '1rem',
      backgroundColor: 'white',
      width: 'fit-content',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      animation: 'pulse 1.5s infinite'
    },
    suggestions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem',
      padding: '0.5rem 0',
      marginBottom: '1rem',
      justifyContent: 'center',
    },
    suggestionButton: {
      padding: '0.75rem 1.25rem',
      backgroundColor: '#F8FAFC',
      border: '2px solid #E2E8F0',
      borderRadius: '2rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      color: '#2563EB',
      fontWeight: '500',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
    },
    inputForm: {
      display: 'flex',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: '#F8FAFC',
      borderRadius: '1rem',
      position: 'relative',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.03)',
    },
    input: {
      flex: 1,
      padding: '0.875rem 1.25rem',
      border: '2px solid #E2E8F0',
      borderRadius: '0.75rem',
      outline: 'none',
      fontSize: '1rem',
      transition: 'all 0.2s',
      backgroundColor: 'white',
    },
    sendButton: {
      padding: '0.875rem',
      backgroundColor: '#2563EB',
      color: 'white',
      border: 'none',
      borderRadius: '0.75rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    ctaSection: {
      width: '45%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '2rem',
    },
    ctaTitle: {
      fontSize: '3.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '1.5rem',
      lineHeight: '1.2'
    },
    ctaText: {
      fontSize: '1.25rem',
      color: '#4B5563',
      marginBottom: '3rem',
      lineHeight: '1.6'
    },
    ctaButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1.25rem 2.5rem',
      background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
      color: 'white',
      fontSize: '1.25rem',
      fontWeight: '600',
      borderRadius: '1rem',
      cursor: 'pointer',
      border: 'none',
      boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
      transition: 'all 0.3s',
      transform: 'translateY(0)'
    },
    logoutConfirmation: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    logoutConfirmationContent: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      width: '400px',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    },
    logoutConfirmationText: {
      fontSize: '1.25rem',
      color: '#1E3A8A',
      marginBottom: '1.5rem',
    },
    logoutConfirmationButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
    },
    logoutConfirmationButton: {
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    confirmButton: {
      backgroundColor: '#2563EB',
      color: 'white',
    },
    cancelButton: {
      backgroundColor: '#E5E7EB',
      color: '#1E3A8A',
    },
  };

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
    "hi": "Hello! How can I assist you today?",
    "hello": "Hello! How can I help you today?",
    "hey": "Hey there! How can I help you?",
    "hey there": "Hey! What can I do for you today?",
    "ok thanks": "You're welcome! Let me know if you need further assistance.",
    "thank you": "You're very welcome! Happy to assist you.",
    "thanks": "You're welcome! Feel free to ask if you need anything else.",
    "ok": "Got it! Let me know if you need anything else.",
    "okay": "Alright! Let me know if you have any more questions.",
    "hi there": "Hey! What can I do for you today?",
    "tnx": "You're welcome! Feel free to ask if you need anything else.",
    "akkunnu penn kittuvo": "yesssssssssssssssssssssss kittum ",
    "alatnu penn kittuvo": "nokki iruno ippo kittummmmmmmmmmmmm ",
  };

  // Add initial welcome message
  useEffect(() => {
    setTimeout(() => {
      setMessages([
        { 
          id: Date.now(), 
          sender: "bot", 
          text: "Hello! Welcome to Evidence Protection. How can I help you today?" 
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const simulateTyping = (text) => {
    setIsTyping(true);
    const typingTime = Math.min(1000 + text.length * 20, 3000);
    
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
      setMessages(prev => [...prev, { id: Date.now(), sender: "user", text: userMessage }]);
      setInputMessage("");

      await simulateTyping(botResponses[userMessage] || "I'm thinking...");
      
      const botResponse = botResponses[userMessage] || 
        "I'm sorry, I don't understand that question. Feel free to try one of the suggested questions below.";
      
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: "bot", text: botResponse }]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, [messages]);

  return (
    <div style={styles.container}>
      <nav style={styles.header}>
        <div style={styles.headerLogo}>
          <Shield size={32} />
          <span>Evidence Protection</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#1E3A8A', transition: 'color 0.3s ease', padding: '8px 12px' }}>Home</Link>
          <button
            onClick={handleLogoutClick}
            style={{ background: "none", border: "none", color: "#1E3A8A", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Logout Confirmation Popup */}
      {showLogoutConfirmation && (
        <div style={styles.logoutConfirmation}>
          <div style={styles.logoutConfirmationContent}>
            <div style={styles.logoutConfirmationText}>Are you sure you want to log out?</div>
            <div style={styles.logoutConfirmationButtons}>
              <button onClick={handleConfirmLogout} style={{ ...styles.logoutConfirmationButton, ...styles.confirmButton }}>
                Yes, Logout
              </button>
              <button onClick={handleCancelLogout} style={{ ...styles.logoutConfirmationButton, ...styles.cancelButton }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.mainContent}>
        <div style={styles.flex}>
          <div style={styles.chatSection}>
            <div style={styles.chatHeader}>
              <ShieldCheck size={36} color="#2563EB" />
              <h3 style={styles.chatTitle}>Verification Guide</h3>
            </div>
            

            <div id="chat-messages" style={styles.chatMessages}>
              {isLoading ? (
                <div style={{...styles.typingIndicator, alignSelf: 'center', margin: '2rem auto'}}>
                  <MessageCircle size={18} />
                  <span style={{ color: '#4B5563' }}>Loading...</span>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      style={{
                        ...styles.message,
                        ...(message.sender === 'user' ? styles.userMessage : styles.botMessage)
                      }}
                    >
                      {message.text}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div style={styles.typingIndicator}>
                      <MessageCircle size={18} />
                      <span style={{ color: '#4B5563' }}>Typing...</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div style={styles.suggestions}>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={styles.suggestionButton}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563EB';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = '#2563EB';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(37, 99, 235, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.color = '#2563EB';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
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
              style={styles.inputForm}
            >
              <input
                type="text"
                placeholder="Type your question here..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E2E8F0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="submit"
                style={styles.sendButton}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Send size={20} />
              </button>
            </form>
          </div>

          <div style={styles.ctaSection}>
            <h1 style={styles.ctaTitle}>Secure Your Digital Evidence</h1>
            <p style={styles.ctaText}>
              Protect the integrity of your files with blockchain technology. Get started with our simple verification process.
            </p>
            <button
              onClick={() => navigate("/button")}
              style={styles.ctaButton}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(37, 99, 235, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.25)';
              }}
            >
              Start Verification Process
              <ArrowRight style={{ transition: 'transform 0.2s' }} />
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes messageSlide {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}
      </style>
    </div>
  );
};

export default VerifyFileChatSection;