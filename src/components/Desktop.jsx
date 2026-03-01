import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SystemHealth from './SystemHealth';
import { useOS } from '../context/OSContext';
import { PixelIcon } from './PixelIcons';

const Desktop = () => {
  const navigate = useNavigate();
  const { isMobile } = useOS();
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
    { id: 'watch', name: 'WATCH', icon: 'clapperboard', path: '/watch', color: '#facc15' },
    { id: 'songs', name: 'MUSIC', icon: 'music', path: '/songs', color: '#f472b6' },
    { id: 'games', name: 'GAMES', icon: 'gamepad', path: '/games', color: '#4ade80' },
    { id: 'studio', name: 'STUDIO', icon: 'monitor', path: '/studio', color: '#60a5fa' },
    { id: 'cloud', name: 'CLOUD', icon: 'cloud', path: '/cloud', color: '#22d3ee' },
    { id: 'cloudcast', name: 'WEATHER', icon: 'rain', path: '/cloudcast', color: '#818cf8' },
    { id: 'collection-tracker', name: 'VAULT', icon: 'package', path: '/collection-tracker', color: '#fbbf24' },
    { id: 'bpm-calculator', name: 'BPM', icon: 'calculator', path: '/bpm-calculator', color: '#f87171' },
  ];

  return (
    <div className="min-h-[100dvh] w-screen bg-[#0a0a0a] flex flex-col p-4 md:p-8">
      {showHealth && <SystemHealth onClose={() => setShowHealth(false)} />}
      
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-5xl justify-items-center">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => navigate(app.path)}
              className="flex flex-col items-center gap-4 group transition-all active:scale-95 w-full"
            >
              <div 
                className="p-6 md:p-8 bg-[#111] border-4 border-[#333] shadow-[4px_4px_0_#000] group-hover:border-white transition-all flex items-center justify-center"
                style={{ color: app.color }}
              >
                <PixelIcon name={app.icon} size={isMobile ? 32 : 48} color="currentColor" />
              </div>
              <span className="text-[10px] md:text-xs text-gray-400 group-hover:text-white transition-colors text-center tracking-tighter">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-auto flex justify-between items-center text-[8px] font-mono text-gray-700 uppercase tracking-tighter border-t-4 border-[#111] pt-4 px-2 shrink-0">
        <span>CHERRY_OS V2.2.0</span>
        <span>SYSTEM_STABLE</span>
      </div>
    </div>
  );
};

export default Desktop;
