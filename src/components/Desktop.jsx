import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Music, Clapperboard, Gamepad2 } from 'lucide-react';

const Desktop = () => {
  const navigate = useNavigate();

  const apps = [
    { id: 'watch', name: 'Watch List', icon: <Clapperboard size={32} />, path: '/watch', color: 'text-yellow-500' },
    { id: 'songs', name: 'My Music', icon: <Music size={32} />, path: '/songs', color: 'text-pink-500' },
    { id: 'games', name: 'Game Center', icon: <Gamepad2 size={32} />, path: '/games', color: 'text-green-500' },
    { id: 'studio', name: 'Studio Rack', icon: <Monitor size={32} />, path: '/studio', color: 'text-blue-500' },
  ];

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] flex flex-col p-6 overflow-hidden">
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8 auto-rows-min">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => navigate(app.path)}
            className="flex flex-col items-center gap-2 group transition-transform hover:scale-105 active:scale-95"
          >
            <div className={`p-4 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl transition-all group-hover:border-white/20 group-hover:bg-gray-800 ${app.color}`}>
              {app.icon}
            </div>
            <span className="text-xs font-bold text-gray-400 tracking-wide uppercase group-hover:text-white transition-colors">
              {app.name}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-auto flex justify-between items-center text-[10px] font-mono text-gray-600 uppercase tracking-widest border-t border-gray-900 pt-4">
        <span>CherryOS 2.0.0</span>
        <span>Stable Build</span>
      </div>
    </div>
  );
};

export default Desktop;
