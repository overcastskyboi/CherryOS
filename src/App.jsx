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
import CodeFlowApp from './apps/CodeFlowApp';
import CloudCastApp from './apps/CloudCastApp';
import ScratchpadApp from './apps/ScratchpadApp';
import CalculatorApp from './apps/CalculatorApp';
import CollectionTrackerApp from './apps/CollectionTrackerApp';

const MainContent = () => {
  const { bootState } = useOS();

  if (bootState === 'off') return <BootScreen />;
  if (bootState === 'locked') return <LockScreen />;

  return (
    <Routes>
      <Route path="/" element={<Desktop />} />
      <Route path="/songs" element={<div className="bg-black"><MySongsApp /></div>} />  
      <Route path="/watch" element={<div className="bg-black"><WatchLogApp /></div>} /> 
      <Route path="/games" element={<div className="bg-black"><GameCenterApp /></div>} />
      <Route path="/studio" element={<div className="bg-black"><StudioRackApp /></div>} />
      <Route path="/cloud" element={<div className="bg-black"><CloudDashboardApp /></div>} />
      <Route path="/codeflow" element={<div className="bg-gray-900"><CodeFlowApp /></div>} />
      <Route path="/cloudcast" element={<div className="bg-blue-900"><CloudCastApp /></div>} />
      <Route path="/scratchpad" element={<div className="bg-gray-800"><ScratchpadApp /></div>} />
      <Route path="/calculator" element={<div className="bg-gray-900"><CalculatorApp /></div>} />
      <Route path="/collection-tracker" element={<div className="bg-slate-900"><CollectionTrackerApp /></div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return <MainContent />;
}
