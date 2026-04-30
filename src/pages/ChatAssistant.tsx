import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2, AlertCircle, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { getElectionResponse } from '../services/gemini';
import { useLanguage } from '../context/LanguageContext';
import DOMPurify from 'dompurify';
import { logUserAction } from '../services/firebase';

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

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

const ChatAssistant = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: language === 'en' 
        ? 'Namaste! I am Votify, your AI Election Assistant. You can type or speak to me!'
        : 'नमस्ते! मैं वोटिफाई हूँ, आपका एआई चुनाव सहायक। आप मुझसे टाइप करके या बोलकर पूछ सकते हैं!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Re-run welcome when language changes if we only have 1 message
    setMessages(prev => {
      if (prev.length === 1) {
        return [{
          id: 'welcome',
          role: 'model',
          text: language === 'en' 
            ? 'Namaste! I am Votify, your AI Election Assistant. You can type or speak to me!'
            : 'नमस्ते! मैं वोटिफाई हूँ, आपका एआई चुनाव सहायक। आप मुझसे टाइप करके या बोलकर पूछ सकते हैं!'
        }];
      }
      return prev;
    });
  }, [language]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Speech Recognition Setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Your browser does not support Speech Recognition.");
      }
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/\\*\\*/g, '').replace(/#/g, ''); // Remove basic markdown for speech
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current && isListening) {
         recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = DOMPurify.sanitize(input.trim());
    if (!userText) return;
    
    logUserAction('chat_message_sent', { length: userText.length });
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages
      .filter(m => m.id !== 'welcome' && !m.isError)
      .map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

    // Pass context about language
    const contextPrefix = language === 'hi' ? "Please reply in Hindi. " : "";
    
    const responseText = await getElectionResponse(contextPrefix + userText, history);
    const isError = responseText.startsWith("Error:");
    
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      isError
    }]);
    setIsLoading(false);
    
    // Auto speak the response
    if (!isError) {
       speakText(responseText);
    }
  };

  return (
    <div className="chat-page container">
      <div className="chat-container glass-card">
        <div className="chat-header">
          <div className="bot-avatar">
            <Bot size={24} />
          </div>
          <div className="header-info">
            <h2>{t('chat')}</h2>
            <div className="header-actions">
              <button 
                className="btn-icon" 
                onClick={() => speakText("Voice output is ready")}
                title={isSpeaking ? "Stop Speaking" : "Start Speaking"}
                aria-label={isSpeaking ? "Stop Speaking" : "Start Speaking"}
              >
                {isSpeaking ? <VolumeX size={20} className="active-icon" /> : <Volume2 size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="messages-area">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              className={`message-wrapper ${msg.role}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="message-avatar">
                {msg.role === 'model' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={`message-bubble ${msg.isError ? 'error-bubble' : ''}`}>
                {msg.isError && <AlertCircle size={16} style={{ marginBottom: '0.5rem', color: '#ef4444' }} />}
                <div>{renderFormattedText(msg.text)}</div>
                {msg.role === 'model' && !msg.isError && (
                  <button className="read-aloud-btn" onClick={() => speakText(msg.text)} aria-label="Read message aloud">
                    <Volume2 size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
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

        <form className="chat-input-area" onSubmit={handleSend}>
          <button 
            type="button" 
            className={`btn-mic ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            title={t('speakText')}
            aria-label={t('speakText')}
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
          />
          <button type="submit" disabled={!input.trim() || isLoading} className="btn-send" aria-label="Send message">
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
          padding: 1.5rem;
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
        .active-icon {
          color: var(--saffron);
          animation: pulse 2s infinite;
        }
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .message-wrapper {
          display: flex;
          gap: 1rem;
          max-width: 85%;
        }
        .message-wrapper.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
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
          padding: 1rem 1.25rem;
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
        .model .message-bubble {
          border-top-left-radius: 0;
          padding-bottom: 2rem;
        }
        .read-aloud-btn {
          position: absolute;
          bottom: 0.5rem;
          right: 0.5rem;
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
        
        .error-bubble { border-color: #ef4444; background: rgba(239, 68, 68, 0.1); }
        .typing { display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); padding-bottom: 1rem !important; }
        .spinner { animation: spin 1s linear infinite; }
        
        .chat-input-area {
          padding: 1.5rem;
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
          padding: 1rem;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 1rem;
          outline: none;
        }
        .chat-input-area input:focus { border-color: var(--primary-color); }
        
        .btn-send {
          background: var(--primary-color);
          color: white;
          width: 50px;
          height: 50px;
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
          width: 50px;
          height: 50px;
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
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @media (max-width: 768px) {
          .message-wrapper { max-width: 95%; }
        }
      `}</style>
    </div>
  );
};

export default ChatAssistant;
