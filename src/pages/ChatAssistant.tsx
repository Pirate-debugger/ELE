import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, AlertCircle, Mic, MicOff, Volume2, VolumeX, Trash2, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSpeech } from '../hooks/useSpeech';
import { useChat } from '../hooks/useChat';

/**
 * Helper to render markdown-like formatting in messages safely.
 * @param text The message text to format.
 */
const renderFormattedText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{
      part.split('\n').map((line, i, arr) => (
        <span key={i}>
          {line}
          {i !== arr.length - 1 && <br />}
        </span>
      ))
    }</span>;
  });
};

/**
 * ChatAssistant Component
 * Provides a production-grade AI interface for election education.
 */
const ChatAssistant = () => {
  const { t, language } = useLanguage();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const welcomeMsg = useMemo(() => language === 'en' 
    ? 'Namaste! I am Votify, your AI Election Assistant. You can type or speak to me!'
    : 'नमस्ते! मैं वोटिफाई हूँ, आपका एआई चुनाव सहायक। आप मुझसे टाइप करके या बोलकर पूछ सकते हैं!',
  [language]);

  const { isSpeaking, isListening, speak, stopSpeaking, startListening, stopListening } = useSpeech(language);
  const { messages, isLoading, sendMessage, clearChat } = useChat(welcomeMsg);

  // Sync welcome message on language change if it's the only message
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome') {
      clearChat(welcomeMsg);
    }
  }, [language, welcomeMsg, messages.length, clearChat]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleToggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening((text) => setInput(text));
    }
  }, [isListening, stopListening, startListening]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setInput('');
    const response = await sendMessage(currentInput, language);
    
    if (response && !response.startsWith("Error:")) {
      speak(response);
    }
  };

  const handleClear = useCallback(() => {
    if (window.confirm(language === 'en' ? "Clear all messages?" : "सभी संदेशों को मिटा दें?")) {
      clearChat(welcomeMsg);
      stopSpeaking();
    }
  }, [language, clearChat, welcomeMsg, stopSpeaking]);

  return (
    <div className="chat-page container">
      <div className="chat-container glass-card">
        <div className="chat-header">
          <div className="bot-avatar">
            <Bot size={24} aria-hidden="true" />
          </div>
          <div className="header-info">
            <div>
              <h2>{t('chat')}</h2>
              <p className="status-text">{isLoading ? (language === 'en' ? 'Thinking...' : 'सोच रहा हूँ...') : (language === 'en' ? 'Online' : 'ऑनलाइन')}</p>
            </div>
            <div className="header-actions">
              <button 
                className="btn-icon" 
                onClick={handleClear}
                title={language === 'en' ? "Clear Chat" : "चैट साफ़ करें"}
                aria-label={language === 'en' ? "Clear Chat" : "चैट साफ़ करें"}
              >
                <Trash2 size={20} />
              </button>
              <button 
                className={`btn-icon ${isSpeaking ? 'active-icon' : ''}`} 
                onClick={() => isSpeaking ? stopSpeaking() : speak(language === 'en' ? "Voice output is ready" : "आवाज आउटपुट तैयार है")}
                title={isSpeaking ? "Stop Speaking" : "Start Speaking"}
                aria-label={isSpeaking ? "Stop Speaking" : "Start Speaking"}
              >
                {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="messages-area" role="log" aria-live="polite">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                className={`message-wrapper ${msg.role}`}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="message-avatar" aria-hidden="true">
                  {msg.role === 'model' ? <Bot size={18} /> : <User size={18} />}
                </div>
                <div className={`message-bubble ${msg.isError ? 'error-bubble' : ''}`}>
                  {msg.isError && <AlertCircle size={16} style={{ marginBottom: '0.5rem', color: '#ef4444' }} />}
                  <div className="message-content">{renderFormattedText(msg.text)}</div>
                  {msg.role === 'model' && !msg.isError && (
                    <button 
                      className="read-aloud-btn" 
                      onClick={() => speak(msg.text)} 
                      aria-label={language === 'en' ? "Read message aloud" : "संदेश जोर से पढ़ें"}
                    >
                      <Volume2 size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div className="message-wrapper model" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="message-avatar"><Bot size={18} /></div>
              <div className="message-bubble typing">
                <Loader2 className="spinner" size={20} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="official-links">
           <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="link-pill">
             <ExternalLink size={14} /> ECI Voter Portal
           </a>
           <a href="https://electoralsearch.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="link-pill">
             <ExternalLink size={14} /> Search Name
           </a>
        </div>

        <form className="chat-input-area" onSubmit={handleSend}>
          <button 
            type="button" 
            className={`btn-mic ${isListening ? 'listening' : ''}`}
            onClick={handleToggleListening}
            title={t('speakText')}
            aria-label={isListening ? "Stop Listening" : t('speakText')}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chatPlaceholder')}
            disabled={isLoading || isListening}
            maxLength={250}
            aria-label={t('chatPlaceholder')}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading} 
            className="btn-send" 
            aria-label={language === 'en' ? "Send message" : "संदेश भेजें"}
          >
            <Send size={20} />
          </button>
        </form>
      </div>

      <style>{`
        .chat-page {
          padding-top: 2rem;
          padding-bottom: 2rem;
          height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chat-container {
          width: 100%;
          max-width: 800px;
          height: 100%;
          max-height: 800px;
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
        }
        .chat-header {
          padding: 1rem 1.5rem;
          background: rgba(15, 23, 42, 0.5);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .header-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-grow: 1;
        }
        .header-info h2 { font-size: 1.25rem; margin: 0; }
        .status-text { font-size: 0.75rem; color: var(--success); margin: 0; }
        .bot-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--primary-color), var(--saffron));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .header-actions { display: flex; gap: 0.5rem; }
        .btn-icon {
          background: transparent;
          color: var(--text-secondary);
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.2s;
        }
        .btn-icon:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }
        .active-icon { color: var(--saffron); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .message-wrapper { display: flex; gap: 0.75rem; max-width: 85%; }
        .message-wrapper.user { align-self: flex-end; flex-direction: row-reverse; }
        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .model .message-avatar { background: rgba(59, 130, 246, 0.2); color: var(--primary-color); }
        .user .message-avatar { background: rgba(245, 158, 11, 0.2); color: var(--accent-color); }
        
        .message-bubble {
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          line-height: 1.5;
          position: relative;
        }
        .user .message-bubble {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
          border-top-right-radius: 0;
        }
        .model .message-bubble { border-top-left-radius: 0; padding-bottom: 2rem; }
        .message-content { font-size: 0.95rem; }
        
        .read-aloud-btn {
          position: absolute;
          bottom: 0.4rem;
          right: 0.4rem;
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .read-aloud-btn:hover { color: white; background: rgba(255, 255, 255, 0.2); }
        
        .official-links {
          display: flex;
          gap: 0.75rem;
          padding: 0.5rem 1.5rem;
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid var(--border-color);
          overflow-x: auto;
        }
        .link-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: 100px;
          font-size: 0.75rem;
          color: var(--text-secondary);
          white-space: nowrap;
          transition: all 0.2s;
        }
        .link-pill:hover { background: rgba(255, 255, 255, 0.1); color: var(--primary-color); border-color: var(--primary-color); }

        .chat-input-area {
          padding: 1rem 1.5rem;
          background: rgba(15, 23, 42, 0.5);
          border-top: 1px solid var(--border-color);
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .chat-input-area input {
          flex: 1;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          padding: 0.8rem 1rem;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.95rem;
          outline: none;
        }
        .chat-input-area input:focus { border-color: var(--primary-color); }
        
        .btn-send {
          background: var(--primary-color);
          color: white;
          width: 44px;
          height: 44px;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-send:hover:not(:disabled) { background: var(--primary-hover); }
        .btn-send:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .btn-mic {
          background: transparent;
          color: var(--text-secondary);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }
        .btn-mic.listening {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border-color: #ef4444;
          animation: pulse-red 1.5s infinite;
        }
        @keyframes pulse-red { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spinner { animation: spin 1s linear infinite; }

        @media (max-width: 768px) {
          .message-wrapper { max-width: 95%; }
          .chat-page { padding: 0; height: calc(100vh - 80px); }
          .chat-container { border-radius: 0; max-height: none; }
        }
      `}</style>
    </div>
  );
};

export default ChatAssistant;

