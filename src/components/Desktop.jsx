import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SystemHealth from './SystemHealth';
import { useOS } from '../context/OSContext';
import { 
  Clapperboard, Music, Gamepad2, Monitor, 
  Cloud, CloudRain, Package, Calculator,
  ChevronRight, Activity
} from 'lucide-react';

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
    { id: 'watch', name: 'Watch List', icon: Clapperboard, path: '/watch', color: 'text-yellow-400', desc: 'Media Tracking' },
    { id: 'songs', name: 'My Music', icon: Music, path: '/songs', color: 'text-pink-400', desc: 'Audio Collection' },
    { id: 'games', name: 'Game Center', icon: Gamepad2, path: '/games', color: 'text-emerald-400', desc: 'Achievement Hub' },
    { id: 'studio', name: 'Studio Rack', icon: Monitor, path: '/studio', color: 'text-blue-400', desc: 'VST Management' },
    { id: 'cloud', name: 'OCI Console', icon: Cloud, path: '/cloud', color: 'text-cyan-400', desc: 'Infrastructure' },
    { id: 'cloudcast', name: 'CloudCast', icon: CloudRain, path: '/cloudcast', color: 'text-indigo-400', desc: 'Local Weather' },
    { id: 'collection-tracker', name: 'The Vault', icon: Package, path: '/collection-tracker', color: 'text-amber-400', desc: 'Asset Tracker' },
    { id: 'bpm-calculator', name: 'BPM Sync', icon: Calculator, path: '/bpm-calculator', color: 'text-rose-400', desc: 'Production Tool' },
  ];

  return (
    <div className="min-h-[100dvh] w-screen bg-[#050505] flex flex-col p-6 md:p-12 relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-950/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-950/10 blur-[120px] rounded-full pointer-events-none" />

      {showHealth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowHealth(false)} />
          <div className="relative w-full max-w-lg">
            <SystemHealth onClose={() => setShowHealth(false)} />
          </div>
        </div>
      )}
      
      <div className="flex-1 flex flex-col items-center justify-center py-12 relative z-10">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => navigate(app.path)}
                className="group relative flex items-center gap-4 p-6 glass-card rounded-2xl transition-all hover:bg-white/[0.06] active:scale-[0.98] text-left overflow-hidden"
              >
                <div className={`p-3 rounded-xl bg-black/40 border border-white/5 ${app.color} group-hover:scale-110 transition-transform duration-500`}>
                  <app.icon size={isMobile ? 24 : 32} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-white uppercase tracking-tighter group-hover:text-blue-400 transition-colors">
                    {app.name}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-0.5 truncate">
                    {app.desc}
                  </p>
                </div>
                <ChevronRight className="text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" size={16} />
                
                {/* Hover Accent */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent group-hover:w-full transition-all duration-700" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] border-t border-white/5 pt-8 px-2 relative z-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            CherryOS 2.3.0 Stable
          </span>
          <span className="hidden md:inline text-gray-800">|</span>
          <span className="text-gray-500">Ashburn Core Active</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setShowHealth(true)} className="hover:text-white transition-colors flex items-center gap-2">
            <Activity size={12} />
            System Metrics
          </button>
          <span className="text-gray-800 hidden md:inline">© 2026</span>
        </div>
      </div>
    </div>
  );
};

export default Desktop;
