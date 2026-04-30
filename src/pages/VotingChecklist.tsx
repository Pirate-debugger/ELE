import { motion } from 'framer-motion';
import { memo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CreditCard, MapPin, Fingerprint, Search, Share2, Save } from 'lucide-react';
import { logUserAction } from '../services/firebase';

const VotingChecklist = () => {
  const { language } = useLanguage();

  const checklistItems = [
    { id: 1, en: "Do you have your Voter ID (EPIC) or another valid ID?", hi: "क्या आपके पास अपना वोटर आईडी (EPIC) या अन्य वैध आईडी है?", icon: <CreditCard size={48} /> },
    { id: 2, en: "Have you checked your name in the Voter List?", hi: "क्या आपने वोटर लिस्ट में अपना नाम जाँचा है?", icon: <Search size={48} /> },
    { id: 3, en: "Do you know where your Polling Booth is?", hi: "क्या आपको पता है कि आपका मतदान केंद्र कहाँ है?", icon: <MapPin size={48} /> },
    { id: 4, en: "Are you ready to press the blue button on the EVM?", hi: "क्या आप EVM पर नीला बटन दबाने के लिए तैयार हैं?", icon: <Fingerprint size={48} /> }
  ];

  const handleAction = useCallback((action: string) => {
    logUserAction('checklist_action', { type: action });
    alert(language === 'en' ? `Checklist ${action}ed successfully!` : `चेकलिस्ट सफलतापूर्वक ${action} हो गई!`);
  }, [language]);

  return (
    <div className="checklist-page container">
      <div className="page-header text-center">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          {language === 'en' ? "Voting Day Checklist" : "मतदान के दिन की चेकलिस्ट"}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {language === 'en' 
            ? "Simple visual guide to ensure you are ready to vote." 
            : "यह सुनिश्चित करने के लिए सरल मार्गदर्शिका कि आप मतदान के लिए तैयार हैं।"}
        </motion.p>
      </div>

      <div className="checklist-grid">
        {checklistItems.map((item, index) => (
          <motion.div 
            key={item.id}
            className="checklist-card glass-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="checklist-icon">{item.icon}</div>
            <h2>{language === 'en' ? item.en : item.hi}</h2>
            <div className="checkbox-wrapper">
              <input type="checkbox" id={`check-${item.id}`} className="custom-checkbox" aria-label={language === 'en' ? item.en : item.hi} />
              <label htmlFor={`check-${item.id}`}></label>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="checklist-actions">
        <button className="btn btn-primary" onClick={() => handleAction('save')}>
          <Save size={20} /> {language === 'en' ? "Save Progress" : "प्रगति सहेजें"}
        </button>
        <button className="btn btn-outline" onClick={() => handleAction('share')}>
          <Share2 size={20} /> {language === 'en' ? "Share Checklist" : "चेकलिस्ट साझा करें"}
        </button>
      </div>

      <style>{`
        .checklist-page { padding-top: 4rem; padding-bottom: 6rem; }
        .page-header { margin-bottom: 4rem; }
        .page-header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          background: linear-gradient(to right, var(--primary-color), var(--saffron));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .checklist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto 4rem;
        }
        .checklist-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 3rem 2rem;
          position: relative;
        }
        .checklist-icon {
          color: var(--primary-color);
          margin-bottom: 1.5rem;
          background: rgba(59, 130, 246, 0.1);
          padding: 1.5rem;
          border-radius: 50%;
        }
        .checklist-card h2 { font-size: 1.25rem; margin-bottom: 2rem; flex-grow: 1; }
        .checklist-actions { display: flex; justify-content: center; gap: 1.5rem; }
        
        .custom-checkbox { display: none; }
        .custom-checkbox + label {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 40px;
          border: 2px solid var(--border-color);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .custom-checkbox:checked + label { background-color: var(--success); border-color: var(--success); }
        .custom-checkbox:checked + label::after {
          content: ''; position: absolute; left: 14px; top: 8px; width: 8px; height: 16px;
          border: solid white; border-width: 0 3px 3px 0; transform: rotate(45deg);
        }
      `}</style>
    </div>
  );
};

export default memo(VotingChecklist);

