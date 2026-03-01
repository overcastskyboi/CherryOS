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
import PokedexApp from './apps/PokedexApp';
import RainBackground from './components/RainBackground';

const MainContent = () => {
  const { bootState } = useOS();

  // Corrected to match OSContext.jsx initial state
  if (bootState === 'booting') return <BootScreen />;
  if (bootState === 'locked') return <LockScreen />;

  return (
    <>
      <RainBackground />
      <div className="relative z-10 min-h-[100dvh]">
        <Routes>
          <Route path="/" element={<Desktop />} />
          <Route path="/songs" element={<div className="bg-black/40 min-h-[100dvh]"><MySongsApp /></div>} />  
          <Route path="/watch" element={<div className="bg-black/40 min-h-[100dvh]"><WatchLogApp /></div>} /> 
          <Route path="/games" element={<div className="bg-black/40 min-h-[100dvh]"><GameCenterApp /></div>} />
          <Route path="/studio" element={<div className="bg-black/40 min-h-[100dvh]"><StudioRackApp /></div>} />
          <Route path="/cloud" element={<div className="bg-black/40 min-h-[100dvh]"><CloudDashboardApp /></div>} />
          <Route path="/cloudcast" element={<div className="bg-blue-900/40 min-h-[100dvh]"><CloudCastApp /></div>} />
          <Route path="/collection-tracker" element={<div className="bg-slate-900/40 min-h-[100dvh]"><CollectionTrackerApp /></div>} />
          <Route path="/bpm-calculator" element={<div className="bg-gray-900/40 min-h-[100dvh]"><BPMTimingCalculator /></div>} />
          <Route path="/pokedex" element={<div className="bg-red-900/40 min-h-[100dvh]"><PokedexApp /></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default function App() {
  return <MainContent />;
}
