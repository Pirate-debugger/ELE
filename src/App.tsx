import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

const Home = lazy(() => import('./pages/Home'));
const ProcessTimeline = lazy(() => import('./pages/ProcessTimeline'));
const ChatAssistant = lazy(() => import('./pages/ChatAssistant'));
const VotingChecklist = lazy(() => import('./pages/VotingChecklist'));

const LoadingFallback = () => (
  <div className="container" style={{ textAlign: 'center', marginTop: '10vh' }}>
    <div className="loading-spinner" style={{ 
      border: '4px solid rgba(255, 255, 255, 0.1)', 
      borderTop: '4px solid var(--primary-color)', 
      borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto' 
    }}></div>
    <p style={{ marginTop: '1rem' }}>Loading...</p>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Navbar />
      <main className="main-content">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/process" element={<ProcessTimeline />} />
            <Route path="/checklist" element={<VotingChecklist />} />
            <Route path="/chat" element={<ChatAssistant />} />
          </Routes>
        </Suspense>
      </main>
    </ErrorBoundary>
  );
}

export default App;
