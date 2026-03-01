import { Routes, Route, Navigate } from 'react-router-dom';
import { useOS } from './context/OSContext';
import BootScreen from './components/BootScreen';
import LockScreen from './components/LockScreen';
import Desktop from './components/Desktop';
import MySongsApp from './apps/MySongsApp';
import WatchLogApp from './apps/WatchLogApp';
import GameCenterApp from './apps/GameCenterApp';
import StudioRackApp from './apps/StudioRackApp';
import CloudDashboardApp from './apps/CloudDashboardApp';
import CloudCastApp from './apps/CloudCastApp';
import CollectionTrackerApp from './apps/CollectionTrackerApp';
import BPMTimingCalculator from './apps/BPMTimingCalculator';
import RainBackground from './components/RainBackground';

const MainContent = () => {
  const { bootState } = useOS();

  if (bootState === 'off') return <BootScreen />;
  if (bootState === 'locked') return <LockScreen />;

  return (
    <>
      <RainBackground />
      <Routes>
        <Route path="/" element={<Desktop />} />
        <Route path="/songs" element={<div className="bg-black/40"><MySongsApp /></div>} />  
        <Route path="/watch" element={<div className="bg-black/40"><WatchLogApp /></div>} /> 
        <Route path="/games" element={<div className="bg-black/40"><GameCenterApp /></div>} />
        <Route path="/studio" element={<div className="bg-black/40"><StudioRackApp /></div>} />
        <Route path="/cloud" element={<div className="bg-black/40"><CloudDashboardApp /></div>} />
        <Route path="/cloudcast" element={<div className="bg-blue-900/40"><CloudCastApp /></div>} />
        <Route path="/collection-tracker" element={<div className="bg-slate-900/40"><CollectionTrackerApp /></div>} />
        <Route path="/bpm-calculator" element={<div className="bg-gray-900/40"><BPMTimingCalculator /></div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default function App() {
  return <MainContent />;
}
