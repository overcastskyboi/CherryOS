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
import CustomCursor from './components/CustomCursor';

const MainContent = () => {
  const { bootState } = useOS();

  // Corrected to match OSContext.jsx initial state
  if (bootState === 'booting') return <BootScreen />;
  if (bootState === 'locked') return <LockScreen />;

  return (
    <>
      <CustomCursor />
      <RainBackground />
      <div className="relative z-10 min-h-[100dvh] selection:bg-rose-500/30 transition-colors duration-1000">
        <Routes>
          <Route path="/" element={<Desktop />} />
          <Route path="/songs" element={<MySongsApp />} />  
          <Route path="/watch" element={<WatchLogApp />} /> 
          <Route path="/games" element={<GameCenterApp />} />
          <Route path="/studio" element={<StudioRackApp />} />
          <Route path="/cloud" element={<CloudDashboardApp />} />
          <Route path="/cloudcast" element={<CloudCastApp />} />
          <Route path="/collection-tracker" element={<CollectionTrackerApp />} />
          <Route path="/bpm-calculator" element={<BPMTimingCalculator />} />
          <Route path="/pokedex" element={<PokedexApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default function App() {
  return <MainContent />;
}
