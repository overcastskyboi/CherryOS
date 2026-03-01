import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCcw, Activity, Music, Clock, Waves } from 'lucide-react';
import { calculateProductionValues } from '../data/constants';

const BPMTimingCalculator = () => {
  const navigate = useNavigate();
  const [bpm, setBpm] = useState(120);

  const results = useMemo(() => calculateProductionValues(bpm), [bpm]);

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-gray-100 flex flex-col font-sans pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-rose-950/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="glass-header sticky top-0 z-40 px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-rose-500 transition-all border border-white/5 shadow-xl">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">BPM Sync</h1>
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.4em] font-bold mt-1">DSP_LINK // CALC_CORE</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">Active Processing</span>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 relative z-10 max-w-6xl mx-auto w-full space-y-12">
        <section className="flex flex-col items-center gap-6 py-8 glass-card rounded-[2.5rem] p-12 border-rose-500/10 shadow-[0_0_50px_rgba(244,63,94,0.05)]">
          <label className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-500/80">Global Tempo Control</label>
          <div className="flex items-end gap-4">
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(Math.max(0, parseInt(e.target.value) || 0))}
              className="bg-transparent text-white text-8xl font-black tracking-tighter w-48 text-center border-b-4 border-rose-500/20 focus:border-rose-500 transition-all outline-none italic"
            />
            <span className="text-2xl font-black text-rose-500 mb-4 tracking-tighter italic uppercase">BPM</span>
          </div>
        </section>

        {results && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-elegant">
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-l-2 border-rose-500 pl-4">
                <Music size={16} className="text-rose-500" />
                <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Precise Time Align</h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(results.delays).map(([note, v]) => (
                  <div key={note} className="glass-card p-4 rounded-2xl flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                    <span className="text-xs font-black text-gray-500 group-hover:text-rose-400 transition-colors tracking-widest">{note}</span>
                    <div className="flex gap-6">
                      <div className="text-right">
                        <p className="text-[8px] text-gray-600 font-black uppercase">Straight</p>
                        <p className="text-xs font-black text-white">{v.straight}ms</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-gray-600 font-black uppercase">Dotted</p>
                        <p className="text-xs font-black text-white">{v.dotted}ms</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-gray-600 font-black uppercase">Triplet</p>
                        <p className="text-xs font-black text-white">{v.triplet}ms</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-l-2 border-rose-500 pl-4">
                  <Waves size={16} className="text-rose-500" />
                  <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">LFO & Rate Sync</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(results.frequencies).map(([note, hz]) => (
                    <div key={note} className="glass-card p-4 rounded-2xl text-center space-y-1">
                      <p className="text-[8px] font-black text-gray-600 uppercase">{note}</p>
                      <p className="text-xs font-black text-rose-400">{hz}Hz</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 border-l-2 border-rose-500 pl-4">
                  <Activity size={16} className="text-rose-500" />
                  <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Engine Values</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card p-4 rounded-2xl flex justify-between items-center">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Tight Pre</span>
                    <span className="text-xs font-black text-white tracking-tighter italic">{results.production.preDelayTight}ms</span>
                  </div>
                  <div className="glass-card p-4 rounded-2xl flex justify-between items-center">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Snap Att</span>
                    <span className="text-xs font-black text-white tracking-tighter italic">{results.production.snapAttack}ms</span>
                  </div>
                  <div className="glass-card p-4 rounded-2xl flex justify-between items-center col-span-2">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Tail Decay (1.5 Bar)</span>
                    <span className="text-xs font-black text-white tracking-tighter italic">{results.production.tailDecay}ms</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 border-l-2 border-rose-500 pl-4">
                  <Clock size={16} className="text-rose-500" />
                  <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Sample Duration</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-2xl">
                    <p className="text-[8px] font-black text-rose-500/60 uppercase mb-1">1 Bar Loop</p>
                    <p className="text-xl font-black text-white italic tracking-tighter">{results.utilities.sampleLength1Bar}s</p>
                  </div>
                  <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-2xl">
                    <p className="text-[8px] font-black text-rose-500/60 uppercase mb-1">4 Bar Loop</p>
                    <p className="text-xl font-black text-white italic tracking-tighter">{results.utilities.sampleLength4Bars}s</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto px-6 py-4 flex justify-between items-center bg-black/40 border-t border-white/5 text-gray-700">
        <span className="text-[8px] font-mono uppercase tracking-widest">DSP_Module: v2.4.0_Stable</span>
        <span className="text-[8px] font-mono uppercase tracking-widest italic text-rose-950">High precision audio math enabled</span>
      </footer>
    </div>
  );
};

export default BPMTimingCalculator;
