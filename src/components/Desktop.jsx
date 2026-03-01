import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOS } from '../context/OSContext';
import { DESKTOP_APPS } from '../data/constants';
import { ChevronRight } from 'lucide-react';

const Desktop = () => {
  const navigate = useNavigate();
  const { isMobile } = useOS();

  return (
    <div className="min-h-[100dvh] w-screen bg-[#050505] flex flex-col p-6 md:p-12 relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-950/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-950/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center py-12 relative z-10">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {DESKTOP_APPS.map((app) => (
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
            CherryOS 2.5.0 Stable
          </span>
          <span className="hidden md:inline text-gray-800">|</span>
          <span className="text-gray-500">Ashburn Core Active</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-gray-800 hidden md:inline">© 2026</span>
        </div>
      </div>
    </div>
  );
};

export default Desktop;
