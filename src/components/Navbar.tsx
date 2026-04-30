import { Link, useLocation } from 'react-router-dom';
import { Vote, Milestone, MessageSquare, ClipboardCheck, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const location = useLocation();
  const { t, language, toggleLanguage } = useLanguage();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="app-header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <Vote color="var(--saffron)" size={32} />
          <span className="text-gradient">Votify India</span>
        </Link>
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            {t('home')}
          </Link>
          <Link to="/process" className={`nav-link ${isActive('/process')}`}>
            <Milestone size={18} /> {t('process')}
          </Link>
          <Link to="/checklist" className={`nav-link ${isActive('/checklist')}`}>
            <ClipboardCheck size={18} /> {t('checklist')}
          </Link>
          <Link to="/chat" className={`nav-link ${isActive('/chat')}`}>
            <MessageSquare size={18} /> {t('chat')}
          </Link>
          <button className="lang-toggle btn-outline" onClick={toggleLanguage}>
            <Languages size={18} /> {language === 'en' ? 'हिंदी' : 'EN'}
          </button>
        </nav>
      </div>
      <style>{`
        .nav-links {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 1rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }
        .nav-link.active {
          color: var(--primary-color);
        }
        .lang-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.8rem;
          border-radius: 2rem;
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
           .nav-link span { display: none; }
           .nav-links { gap: 0.5rem; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
