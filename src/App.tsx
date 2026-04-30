import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProcessTimeline from './pages/ProcessTimeline';
import ChatAssistant from './pages/ChatAssistant';
import VotingChecklist from './pages/VotingChecklist';

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/process" element={<ProcessTimeline />} />
          <Route path="/checklist" element={<VotingChecklist />} />
          <Route path="/chat" element={<ChatAssistant />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
