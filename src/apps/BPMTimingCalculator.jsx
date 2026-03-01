import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, RefreshCcw, Activity, Music, Clock, Waves, 
  Settings2, Zap, Info, Layers, Wind, Mic2
} from 'lucide-react';
import { calculateProductionValues } from '../data/constants';

import { useOS } from '../context/OSContext';

const BPMTimingCalculator = () => {
  const navigate = useNavigate();
  const { setThemeColor, isMobile } = useOS();

  useEffect(() => {
    setThemeColor('#9f1239'); // Cherry Crimson/Rose
  }, [setThemeColor]);
  const [bpm, setBpm] = useState(128);

  const results = useMemo(() => calculateProductionValues(bpm), [bpm]);
  const hasResults = results && results.delays;

  const InfoTag = ({ text }) => (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg border border-white/5 mb-4">
      <Info size={10} className="text-rose-500" />
      <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none">{text}</span>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-gray-100 flex flex-col font-sans pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-rose-950/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="glass-header sticky top-0 z-40 px-4 md:px-6 py-4 md:py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={() => navigate('/')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-rose-500 transition-all border border-white/5 shadow-xl">
            <ArrowLeft size={isMobile ? 18 : 20} />
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tighter text-white uppercase italic leading-none">BPM Sync</h1>
            <p className="text-[8px] md:text-[9px] text-gray-500 uppercase tracking-[0.4em] font-bold mt-1 mobile-hide">Assistant // v2.5.2</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-none">Status</p>
            <p className="text-[10px] font-black text-rose-500 uppercase italic">Computing</p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
        </div>
      </header>

      <main className="flex-1 p-4 md:p-12 relative z-10 max-w-7xl mx-auto w-full space-y-8 md:space-y-12">
        {/* Tempo Module */}
        <section className="flex flex-col items-center gap-4 md:gap-8 py-8 md:py-12 glass-card rounded-2xl md:rounded-[3rem] border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none" />
          <div className="text-center space-y-1 md:space-y-2 relative z-10 px-4">
            <label className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-rose-500">Universal Tempo Pulse</label>
            <p className="text-[7px] md:text-[9px] text-gray-600 font-bold uppercase mobile-hide">Adjust to match your DAW session</p>
          </div>
          <div className="flex items-end gap-3 md:gap-6 relative z-10">
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(Math.max(1, parseInt(e.target.value) || 0))}
              className="bg-transparent text-white text-7xl md:text-[10rem] font-black tracking-tighter w-40 md:w-72 text-center border-b-2 md:border-b-4 border-rose-500/10 focus:border-rose-500/40 transition-all outline-none italic leading-none selection:bg-rose-500/30"
            />
            <span className="text-xl md:text-3xl font-black text-rose-500 mb-2 md:mb-6 tracking-tighter italic uppercase drop-shadow-[0_0_20px_rgba(244,63,94,0.3)]">BPM</span>
          </div>
        </section>

        {hasResults ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 animate-elegant">
            {/* Delay & Time Alignment Module */}
            <div className="lg:col-span-5 space-y-6 md:space-y-8">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-3 border-l-2 border-rose-500 pl-4">
                  <Clock size={16} className="text-rose-500" />
                  <h2 className="text-xs md:text-sm font-black text-white uppercase tracking-widest italic">Time Alignment</h2>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(results.delays).map(([note, v]) => (
                    <div key={note} className="glass-card p-4 md:p-5 rounded-xl md:rounded-[1.5rem] flex items-center justify-between group hover:bg-white/[0.03] transition-all border-white/[0.02]">
                      <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs font-black text-gray-500 group-hover:text-rose-400 transition-colors tracking-widest">{note}</span>
                      </div>
                      <div className="flex gap-4 md:gap-8">
                        <div className="text-right space-y-0.5">
                          <p className="text-[7px] md:text-[8px] text-gray-600 font-black uppercase tracking-tighter">Str</p>
                          <p className="text-xs md:text-sm font-black text-white italic">{v.straight}</p>
                        </div>
                        <div className="text-right space-y-0.5">
                          <p className="text-[7px] md:text-[8px] text-rose-900 font-black uppercase tracking-tighter">Dot</p>
                          <p className="text-xs md:text-sm font-black text-rose-400/80 italic">{v.dotted}</p>
                        </div>
                        <div className="text-right space-y-0.5">
                          <p className="text-[7px] md:text-[8px] text-gray-600 font-black uppercase tracking-tighter">Tri</p>
                          <p className="text-xs md:text-sm font-black text-white italic">{v.triplet}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modulation & Dynamics Modules */}
            <div className="lg:col-span-7 space-y-10 md:space-y-12">
              {/* LFO Section */}
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-3 border-l-2 border-rose-500 pl-4">
                  <Waves size={16} className="text-rose-500" />
                  <h2 className="text-xs md:text-sm font-black text-white uppercase tracking-widest italic">Oscillation Rates</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {Object.entries(results.lfoHz).map(([note, hz]) => (
                    <div key={note} className="glass-card p-4 md:p-6 rounded-2xl md:rounded-3xl text-center space-y-1 group hover:border-rose-500/20 transition-all">
                      <p className="text-[8px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest">{note}</p>
                      <p className="text-lg md:text-2xl font-black text-rose-500 italic tracking-tighter">{hz}Hz</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Compressor Section */}
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3 border-l-2 border-rose-500 pl-4">
                    <Zap size={16} className="text-rose-500" />
                    <h2 className="text-xs md:text-sm font-black text-white uppercase tracking-widest italic">Dynamics</h2>
                  </div>
                  <div className="glass-card p-5 md:p-6 rounded-2xl md:rounded-[2rem] space-y-4 md:space-y-6">
                    <div className="flex justify-between items-center group">
                      <span className="text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-widest group-hover:text-rose-400 transition-colors">Snap Attack</span>
                      <span className="text-lg md:text-xl font-black text-white italic">{results.compressor.attackSnapMs}ms</span>
                    </div>
                    <div className="h-[1px] bg-white/5" />
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] md:text-[9px] font-black text-gray-600 uppercase">Fast</span>
                        <span className="text-xs md:text-sm font-black text-white italic">{results.compressor.releaseFastMs}ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] md:text-[9px] font-black text-gray-600 uppercase">Mid</span>
                        <span className="text-xs md:text-sm font-black text-white italic">{results.compressor.releaseMediumMs}ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] md:text-[9px] font-black text-gray-600 uppercase">Slow</span>
                        <span className="text-xs md:text-sm font-black text-white italic">{results.compressor.releaseSlowMs}ms</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reverb Section */}
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3 border-l-2 border-rose-500 pl-4">
                    <Mic2 size={16} className="text-rose-500" />
                    <h2 className="text-xs md:text-sm font-black text-white uppercase tracking-widest italic">Ambience</h2>
                  </div>
                  <div className="glass-card p-5 md:p-6 rounded-2xl md:rounded-[2rem] space-y-4 md:space-y-6 bg-gradient-to-br from-rose-500/5 to-transparent">
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-[8px] md:text-[9px] font-black text-gray-500 uppercase leading-none">Pre-Delay</span>
                          <span className="text-[6px] md:text-[7px] font-bold text-gray-700 uppercase italic">Tight</span>
                        </div>
                        <span className="text-lg md:text-xl font-black text-white italic">{results.reverb.preDelayTightMs}ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-[8px] md:text-[9px] font-black text-gray-500 uppercase leading-none">Pre-Delay</span>
                          <span className="text-[6px] md:text-[7px] font-bold text-gray-700 uppercase italic">Hall</span>
                        </div>
                        <span className="text-lg md:text-xl font-black text-white italic">{results.reverb.preDelayMediumMs}ms</span>
                      </div>
                    </div>
                    <div className="h-[1px] bg-white/10" />
                    <div className="flex justify-between items-center group">
                      <div className="flex flex-col">
                        <span className="text-[8px] md:text-[9px] font-black text-rose-500 uppercase tracking-widest">Decay</span>
                        <span className="text-[6px] md:text-[7px] font-bold text-rose-900 uppercase italic leading-none">Whole</span>
                      </div>
                      <span className="text-xl md:text-2xl font-black text-white italic">{results.reverb.tailDecayMs}ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-700 space-y-4">
            <Activity size={64} className="opacity-10 animate-pulse" />
            <p className="text-xs font-black uppercase tracking-[0.5em] italic">Awaiting Synchronized Input Signal</p>
          </div>
        )}
      </main>

      <footer className="mt-auto px-6 py-4 flex justify-between items-center bg-black/40 border-t border-white/5 text-gray-700 sticky bottom-0 z-50">
        <div className="flex items-center gap-4">
          <span className="text-[8px] font-mono uppercase tracking-widest italic">Engine_Link: v2.5.2_Stable</span>
          <span className="hidden sm:inline text-gray-800">|</span>
          <span className="text-[8px] font-mono uppercase tracking-widest text-emerald-500/50">Mathematics: Nominal</span>
        </div>
        <span className="text-[8px] font-mono uppercase tracking-widest italic text-rose-900 hidden md:block">High-performance audio synchronization active</span>
      </footer>
    </div>
  );
};

export default BPMTimingCalculator;
