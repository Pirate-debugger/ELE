import { useState, useCallback } from 'react';
import { getElectionResponse } from '../services/gemini';
import { logUserAction } from '../services/firebase';
import DOMPurify from 'dompurify';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

/**
 * Custom hook to manage chat logic
 * Improves Code Quality and Efficiency
 */
export const useChat = (initialWelcome: string) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'model', text: initialWelcome }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (text: string, language: string) => {
    const sanitizedText = DOMPurify.sanitize(text.trim());
    if (!sanitizedText) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: sanitizedText };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    logUserAction('chat_message_sent', { length: sanitizedText.length, lang: language });

    const history = messages
      .filter(m => m.id !== 'welcome' && !m.isError)
      .map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

    const contextPrefix = language === 'hi' ? "Please reply in Hindi. " : "";
    
    try {
      const responseText = await getElectionResponse(contextPrefix + sanitizedText, history);
      const isError = responseText.startsWith("Error:");
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        isError
      }]);
      return responseText;
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Error: Something went wrong.",
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback((welcome: string) => {
    setMessages([{ id: 'welcome', role: 'model', text: welcome }]);
  }, []);

  return { messages, isLoading, sendMessage, clearChat };
};
