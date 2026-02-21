import { Routes, Route } from 'react-router-dom';
import Desktop from './components/Desktop';
import WatchLogApp from './apps/WatchLogApp';
import MySongsApp from './apps/MySongsApp';
import GameCenterApp from './apps/GameCenterApp';
import StudioRackApp from './apps/StudioRackApp';
import BootScreen from './components/BootScreen';
import { useOS } from './context/OSContext';

function App() {
  const { bootState } = useOS();

  if (bootState === 'booting') return <BootScreen />;

  return (
    <Routes>
      <Route path="/" element={<Desktop />} />
      <Route path="/watch" element={<WatchLogApp />} />
      <Route path="/songs" element={<MySongsApp />} />
      <Route path="/games" element={<GameCenterApp />} />
      <Route path="/studio" element={<StudioRackApp />} />
    </Routes>
  );
}

export default App;
