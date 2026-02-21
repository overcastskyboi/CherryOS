import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OSProvider, useOS } from './context/OSContext';
import BootScreen from './components/BootScreen';
import LockScreen from './components/LockScreen';
import Desktop from './components/Desktop';
import MySongsApp from './apps/MySongsApp';
import WatchLogApp from './apps/WatchLogApp';
import GameCenterApp from './apps/GameCenterApp';
import StudioRackApp from './apps/StudioRackApp';
import CloudDashboardApp from './apps/CloudDashboardApp';

const MainContent = () => {
  const { bootState } = useOS();
  
  if (bootState === 'off') return <BootScreen />;
  if (bootState === 'locked') return <LockScreen />;
  
  return (
    <Routes>
      <Route path="/" element={<Desktop />} />
      <Route path="/songs" element={<div className="h-screen w-screen bg-black overflow-hidden"><MySongsApp /></div>} /> 
      <Route path="/watch" element={<div className="h-screen w-screen bg-black overflow-hidden"><WatchLogApp /></div>} />
      <Route path="/games" element={<div className="h-screen w-screen bg-black overflow-hidden"><GameCenterApp /></div>} />
      <Route path="/studio" element={<div className="h-screen w-screen bg-black overflow-hidden"><StudioRackApp /></div>} />
      <Route path="/cloud" element={<div className="h-screen w-screen bg-black overflow-hidden"><CloudDashboardApp /></div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <OSProvider>
      <Router basename="/CherryOS">
        <MainContent />
      </Router>
    </OSProvider>
  );
}
