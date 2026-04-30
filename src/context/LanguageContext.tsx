/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, type ReactNode } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: Translations = {
  home: { en: "Home", hi: "होम" },
  process: { en: "Process Timeline", hi: "प्रक्रिया समयरेखा" },
  chat: { en: "AI Assistant", hi: "एआई सहायक" },
  checklist: { en: "Voting Checklist", hi: "मतदान चेकलिस्ट" },
  heroTitle1: { en: "Your Voice, Your Power:", hi: "आपकी आवाज़, आपकी ताकत:" },
  heroTitle2: { en: "The Election Process", hi: "चुनाव प्रक्रिया" },
  heroTitle3: { en: "Demystified.", hi: "सरल बनाई गई।" },
  heroSubtitle: { en: "Navigate the world's largest democracy with confidence. From registration to the polling booth, we guide you every step of the way.", hi: "दुनिया के सबसे बड़े लोकतंत्र को आत्मविश्वास के साथ नेविगेट करें। पंजीकरण से लेकर मतदान केंद्र तक, हम हर कदम पर आपका मार्गदर्शन करते हैं।" },
  exploreBtn: { en: "Explore the Timeline", hi: "समयरेखा देखें" },
  askAiBtn: { en: "Ask AI Assistant", hi: "एआई सहायक से पूछें" },
  empowering: { en: "Empowering the Indian Voter", hi: "भारतीय मतदाता को सशक्त बनाना" },
  chatPlaceholder: { en: "Ask about the Indian election process...", hi: "भारतीय चुनाव प्रक्रिया के बारे में पूछें..." },
  listenText: { en: "Listen", hi: "सुनें" },
  speakText: { en: "Speak", hi: "बोलें" }
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const t = (key: string) => {
    if (translations[key]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
