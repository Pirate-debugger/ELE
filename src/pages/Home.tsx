import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Info, ShieldCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="badge">
            <span className="badge-dot"></span>
            Empowering the Indian Voter
          </div>
          <h1 className="hero-title">
            Your Voice, Your Power:<br />
            <span className="text-gradient">The Election Process</span> Demystified.
          </h1>
          <p className="hero-subtitle">
            Navigate the world's largest democracy with confidence. From registration to the polling booth, we guide you every step of the way.
          </p>
          <div className="hero-actions">
            <Link to="/process" className="btn btn-primary">
              Explore the Timeline <ArrowRight size={18} />
            </Link>
            <Link to="/chat" className="btn btn-outline">
              Ask AI Assistant
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          className="hero-image-wrapper glass-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="floating-stat stat-1">
            <CheckCircle color="var(--success)" size={24} />
            <div>
              <strong>900M+</strong>
              <span>Eligible Voters</span>
            </div>
          </div>
          <div className="floating-stat stat-2">
            <ShieldCheck color="var(--primary-color)" size={24} />
            <div>
              <strong>100%</strong>
              <span>Secure EVM Voting</span>
            </div>
          </div>
          <div className="central-graphic">
             <div className="pulse-ring"></div>
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ashoka_Chakra.svg/1024px-Ashoka_Chakra.svg.png" alt="Ashoka Chakra" className="chakra-img" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features container">
        <motion.div className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Why Be An <span className="text-gradient-primary">Informed Voter?</span></h2>
          <p>Understanding the electoral system is the first step to making a difference.</p>
        </motion.div>

        <div className="feature-grid">
          {[
            { title: "Understand Registration", desc: "Learn about Form 6, checking electoral rolls, and NVSP.", icon: <Info /> },
            { title: "Know Your Candidates", desc: "Access information on candidate affidavits and backgrounds.", icon: <ShieldCheck /> },
            { title: "Master the Process", desc: "Step-by-step guide on what to do on the polling day.", icon: <CheckCircle /> }
          ].map((feat, idx) => (
            <motion.div 
              key={idx}
              className="feature-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="feature-icon">{feat.icon}</div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <style>{`
        .home-container {
          padding-bottom: 4rem;
        }
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          padding-top: 6rem;
          padding-bottom: 6rem;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 153, 51, 0.1);
          border: 1px solid rgba(255, 153, 51, 0.2);
          border-radius: 2rem;
          color: var(--saffron);
          font-weight: 500;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }
        .badge-dot {
          width: 8px;
          height: 8px;
          background-color: var(--saffron);
          border-radius: 50%;
        }
        .hero-title {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          max-width: 90%;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
        }
        
        .hero-image-wrapper {
          position: relative;
          height: 450px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9));
          overflow: hidden;
        }
        .central-graphic {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chakra-img {
          width: 200px;
          opacity: 0.8;
          animation: spin 30s linear infinite;
        }
        .pulse-ring {
          position: absolute;
          width: 250px;
          height: 250px;
          border: 2px solid var(--primary-color);
          border-radius: 50%;
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .floating-stat {
          position: absolute;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border-color);
          padding: 1rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
          z-index: 10;
        }
        .floating-stat div {
          display: flex;
          flex-direction: column;
        }
        .floating-stat strong {
          font-size: 1.25rem;
          font-family: var(--font-heading);
        }
        .floating-stat span {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .stat-1 {
          top: 2rem;
          left: -2rem;
          animation: float 6s ease-in-out infinite;
        }
        .stat-2 {
          bottom: 2rem;
          right: -2rem;
          animation: float 8s ease-in-out infinite alternate;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .section-header h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .section-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .feature-card {
          text-align: center;
          padding: 3rem 2rem;
        }
        .feature-icon {
          width: 60px;
          height: 60px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem auto;
          color: var(--primary-color);
        }
        .feature-card h3 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }
        .feature-card p {
          color: var(--text-secondary);
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.2; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .hero { grid-template-columns: 1fr; }
          .hero-title { font-size: 2.5rem; }
          .feature-grid { grid-template-columns: 1fr; }
          .stat-1 { left: 1rem; }
          .stat-2 { right: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default Home;
