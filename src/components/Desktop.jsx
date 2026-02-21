import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Music, Clapperboard, Gamepad2, Cloud } from 'lucide-react';
import SystemHealth from './SystemHealth';

const Desktop = () => {
  const navigate = useNavigate();
  const [showHealth, setShowHealth] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        setShowHealth(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const apps = [
    { id: 'watch', name: 'Watch List', icon: <Clapperboard size={64} />, path: '/watch', color: 'text-yellow-500' },      
    { id: 'songs', name: 'My Music', icon: <Music size={64} />, path: '/songs', color: 'text-pink-500' },
    { id: 'games', name: 'Game Center', icon: <Gamepad2 size={64} />, path: '/games', color: 'text-green-500' },
    { id: 'studio', name: 'Studio Rack', icon: <Monitor size={64} />, path: '/studio', color: 'text-blue-500' },
    { id: 'cloud', name: 'OCI Console', icon: <Cloud size={64} />, path: '/cloud', color: 'text-cyan-500' },
  ];

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] flex flex-col p-12 overflow-hidden">
      {showHealth && <SystemHealth onClose={() => setShowHealth(false)} />}
      
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24 w-full max-w-6xl justify-items-center">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => navigate(app.path)}
              className="flex flex-col items-center gap-6 group transition-transform hover:scale-110 active:scale-95 w-full"
            >
              <div className={`p-10 rounded-[2.5rem] bg-gray-900 border border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all group-hover:border-white/20 group-hover:bg-gray-800 group-hover:shadow-white/5 ${app.color}`}>
                {app.icon}
              </div>
              <span className="text-sm font-black text-gray-400 tracking-[0.2em] uppercase group-hover:text-white transition-colors">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-auto flex justify-between items-center text-[10px] font-mono text-gray-600 uppercase tracking-widest border-t border-gray-900 pt-4">
        <span>CherryOS 2.0.0</span>
        <span>Stable Build</span>
      </div>
    </div>
  );
};

export default Desktop;
