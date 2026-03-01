import { User, ShieldCheck } from 'lucide-react';
import { useOS } from '../context/OSContext';
import { useEffect, useState } from 'react';

const LockScreen = () => {
  const { setBootState } = useOS();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      onClick={() => setBootState('desktop')} 
      className="h-screen w-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden cursor-pointer group select-none"
    >
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614726365723-49cfae96c698?q=80&w=2600&auto=format&fit=crop')] bg-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-[2000ms] ease-out" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] opacity-80" />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md group-hover:backdrop-blur-0 transition-all duration-[1000ms]" />

      <div className="absolute top-12 md:top-24 left-1/2 -translate-x-1/2 text-center space-y-2 z-20">
        <p className="text-6xl md:text-8xl font-black italic tracking-tighter text-white/90">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        </p>
        <p className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-[0.5em]">
          {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="z-10 text-center space-y-8 animate-elegant">
        <div className="relative mx-auto group-hover:scale-105 transition-transform duration-700">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[3rem] border-2 border-rose-500/20 flex items-center justify-center mx-auto bg-black/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
            <User size={64} className="text-rose-500 group-hover:text-white transition-colors duration-500" />
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="absolute -bottom-2 -right-2 p-3 bg-rose-500 rounded-2xl text-black shadow-2xl animate-in zoom-in-50 duration-500 delay-300">
            <ShieldCheck size={20} strokeWidth={3} />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic text-white group-hover:text-rose-400 transition-colors">CHERRY OS</h1>
          <p className="text-gray-500 font-black text-[10px] tracking-[0.4em] uppercase">User_Authenticated // ColinCherry</p>
        </div>

        <div className="pt-12">
          <p className="text-rose-500 font-black text-[9px] tracking-[0.6em] animate-pulse uppercase">Initialize Neural Link</p>
        </div>
      </div>

      <div className="absolute bottom-12 flex items-center gap-6 opacity-30 text-[9px] font-black uppercase tracking-widest text-gray-500 z-20">
        <span>Cloud Sync: Nominal</span>
        <span className="text-gray-800">|</span>
        <span>Neural Mesh: Linked</span>
      </div>
    </div>
  );
};

export default LockScreen;
