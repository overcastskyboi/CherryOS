import { useState, useEffect } from 'react';
import { useOS } from '../context/OSContext';

const BootScreen = () => {
  const { setBootState } = useOS();
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  const bootLogs = [
    'Initializing CherryOS Kernel...',
    'Loading Neural Network Drivers...',
    'Establishing Secure Cloud Mirror...',
    'Syncing Bio-Archive Data...',
    'Calibrating Interface Modules...',
    'Boot Sequence Nominal.'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(100, p + Math.floor(Math.random() * 15));
      });
    }, 150);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const logInterval = setInterval(() => {
      setLogs((prev) => {
        if (prev.length < bootLogs.length) {
          return [...prev, bootLogs[prev.length]];
        }
        return prev;
      });
    }, 200);
    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setBootState('locked'), 800);
    }
  }, [progress, setBootState]);

  return (
    <div className="h-screen w-screen bg-[#050505] flex flex-col items-center justify-center font-mono relative overflow-hidden">
      {/* Glitch Background Effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent animate-pulse" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative group mb-8">
          <img 
            src={`${import.meta.env.BASE_URL}assets/images/cloud_mascot.svg`} 
            alt="Cloud Mascot" 
            className="w-24 h-24 group-hover:scale-110 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl opacity-20 animate-pulse" />
        </div>

        <div className="w-80 space-y-6">
          <div className="h-48 overflow-hidden flex flex-col justify-end">
            {logs.map((log, i) => (
              <p key={i} className="text-[10px] text-emerald-500/60 uppercase tracking-widest animate-in slide-in-from-left-2 duration-300">
                <span className="opacity-30 mr-2">[{new Date().toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 2 })}]</span>
                {log}
              </p>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black text-emerald-500 tracking-[0.2em]">
              <span>CORE_INITIALIZATION</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-12 text-[8px] text-gray-700 font-bold uppercase tracking-[0.5em]">
        CherryOS Kernel v2.5.1 // Build 03-2026
      </div>
    </div>
  );
};

export default BootScreen;
