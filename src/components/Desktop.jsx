import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOS } from '../context/OSContext';
import { DESKTOP_APPS } from '../data/constants';
import { ChevronRight } from 'lucide-react';

const Desktop = () => {
  const navigate = useNavigate();
  const { isMobile, setThemeColor } = useOS();

  useEffect(() => {
    setThemeColor('#3b82f6'); // Reset to default blue on desktop
  }, [setThemeColor]);

  return (
    <div className="min-h-[100dvh] w-screen bg-transparent flex flex-col p-4 md:p-12 relative overflow-x-hidden">
      {/* Background Glows Refined */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center py-8 md:py-12 relative z-10">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {DESKTOP_APPS.map((app) => (
              <button
                key={app.id}
                onClick={() => navigate(app.path)}
                className="group relative flex items-center gap-4 md:gap-6 p-5 md:p-8 glass-card rounded-2xl md:rounded-[2.5rem] transition-all hover:bg-white/[0.08] hover:-translate-y-1 active:scale-[0.98] text-left overflow-hidden border-white/5 shadow-2xl"
              >
                <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl bg-black/40 border border-white/5 ${app.color} group-hover:scale-110 transition-transform duration-500 shadow-inner relative z-10`}>
                  <app.icon size={isMobile ? 24 : 36} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0 relative z-10">
                  <h3 className="text-base font-black text-white uppercase italic tracking-tighter group-hover:text-blue-400 transition-colors leading-none">
                    {app.name}
                  </h3>
                </div>
                <ChevronRight className="text-gray-800 group-hover:text-white group-hover:translate-x-1 transition-all" size={20} />
                
                {/* App Specific Glow Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent group-hover:w-full transition-all duration-[800ms] ease-in-out" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] border-t border-white/5 pt-8 px-2 relative z-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            CherryOS 2.5.1 Stable
          </span>
          <span className="hidden md:inline text-gray-800">|</span>
          <span className="text-gray-500">Ashburn Core Active</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-gray-800 hidden md:inline">© 2026 Colin Cherry</span>
        </div>
      </div>
    </div>
  );
};

export default Desktop;
