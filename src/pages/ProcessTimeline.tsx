import { memo } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, FileSearch, MapPin, Search, CheckSquare, Fingerprint } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Voter Registration",
    description: "Fill Form 6 online via the Voter Portal or offline to get your name on the Electoral Roll if you are 18+.",
    icon: <UserPlus size={24} />,
    color: "var(--primary-color)"
  },
  {
    id: 2,
    title: "Verify Name in Voter List",
    description: "Check your name in the final electoral roll (Voter List) on the NVSP portal or Election Commission website.",
    icon: <FileSearch size={24} />,
    color: "var(--saffron)"
  },
  {
    id: 3,
    title: "Find Your Polling Station",
    description: "Locate your assigned polling booth using your EPIC number or the Know Your Polling Station app.",
    icon: <MapPin size={24} />,
    color: "var(--green)"
  },
  {
    id: 4,
    title: "Know Your Candidates",
    description: "Research candidates contesting in your constituency using the KYC App to make an informed decision.",
    icon: <Search size={24} />,
    color: "var(--accent-color)"
  },
  {
    id: 5,
    title: "Voting Day Preparation",
    description: "Carry your EPIC (Voter ID) or any of the 11 alternative approved photo ID documents to the polling station.",
    icon: <CheckSquare size={24} />,
    color: "var(--primary-hover)"
  },
  {
    id: 6,
    title: "Cast Your Vote",
    description: "Press the blue button on the EVM against your chosen candidate. Verify the printed slip in the VVPAT machine.",
    icon: <Fingerprint size={24} />,
    color: "var(--success)"
  }
];

const ProcessTimeline = () => {
  return (
    <div className="timeline-page container">
      <div className="page-header text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          The <span className="text-gradient">Electoral Process</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Your step-by-step guide to participating in the world's largest democracy.
        </motion.p>
      </div>

      <div className="timeline-container">
        {steps.map((step, index) => (
          <motion.div 
            className="timeline-item"
            key={step.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className={`timeline-content ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-card glass-card">
                <div className="step-number" style={{ background: step.color }}>
                  {step.id}
                </div>
                <div className="step-icon" style={{ color: step.color }}>
                  {step.icon}
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
            <div className="timeline-center">
              <div className="timeline-dot" style={{ borderColor: step.color }}></div>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .timeline-page {
          padding-top: 4rem;
          padding-bottom: 6rem;
        }
        .page-header {
          margin-bottom: 5rem;
        }
        .page-header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .page-header p {
          font-size: 1.25rem;
          color: var(--text-secondary);
        }

        .timeline-container {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
        }
        /* Vertical Line */
        .timeline-container::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 4px;
          background: var(--border-color);
          transform: translateX(-50%);
          border-radius: 2px;
        }

        .timeline-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4rem;
          position: relative;
        }

        .timeline-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }

        .timeline-dot {
          width: 24px;
          height: 24px;
          background: var(--bg-color);
          border: 4px solid;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.8);
        }

        .timeline-content {
          width: 45%;
        }
        .timeline-content.left {
          text-align: right;
          padding-right: 2rem;
        }
        .timeline-content.right {
          text-align: left;
          padding-left: 2rem;
          margin-left: auto;
        }

        .timeline-card {
          position: relative;
          padding: 2rem;
        }
        
        .step-number {
          position: absolute;
          top: -15px;
          right: -15px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-family: var(--font-heading);
          font-size: 1.2rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .timeline-content.left .step-number {
          right: auto;
          left: -15px;
        }

        .step-icon {
          margin-bottom: 1rem;
          background: rgba(255, 255, 255, 0.05);
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .timeline-card h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .timeline-card p {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .timeline-container::before {
            left: 30px;
          }
          .timeline-center {
            left: 30px;
          }
          .timeline-content {
            width: calc(100% - 80px);
            margin-left: 80px !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            text-align: left !important;
          }
          .step-number {
            right: -15px !important;
            left: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default memo(ProcessTimeline);
