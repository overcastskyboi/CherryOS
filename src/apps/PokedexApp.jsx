import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Dna, Footprints, BarChart2, 
  BookOpen, RefreshCcw, Sparkles, Box,
  Info, Ruler, Weight, LayoutGrid, Maximize2
} from 'lucide-react';
import LazyImage from '../components/LazyImage';

const PokedexApp = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('gallery'); // 'gallery' or 'details'
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShiny, setIsShiny] = useState(false);
  const [selectedVersionGroup, setSelectedVersionGroup] = useState('');

  const fetchMirroredData = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const path = `${baseUrl}data/mirror/pokedex.json`.replace(/\/+/g, '/');
      const response = await fetch(path);
      if (!response.ok) throw new Error("Failed to load database");
      const data = await response.json();
      setPokemonList(data);
    } catch (err) {
      console.error('Pokedex Data Load Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMirroredData();
  }, [fetchMirroredData]);

  const handleOpenDetails = (pokemon) => {
    setSelectedPokemon(pokemon);
    setIsShiny(false);
    setView('details');
    const versions = Object.keys(pokemon.moves);
    if (versions.length > 0) setSelectedVersionGroup(versions[0]);
  };

  const getStatColor = (name) => {
    const colors = {
      hp: 'bg-emerald-500',
      attack: 'bg-red-500',
      defense: 'bg-blue-500',
      'special-attack': 'bg-purple-500',
      'special-defense': 'bg-pink-500',
      speed: 'bg-yellow-500'
    };
    return colors[name] || 'bg-gray-500';
  };

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-red-500 font-mono gap-4">
      <RefreshCcw className="animate-spin" size={32} />
      <span className="tracking-[0.5em] animate-pulse uppercase text-[10px] font-bold text-red-900">Syncing Bio-Archive...</span>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-white flex flex-col font-mono animate-elegant pb-20">
      <style>{`
        .pokedex-glass { background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); }
        .stat-bar { background: rgba(255,255,255,0.05); height: 4px; border-radius: 2px; overflow: hidden; }
        .stat-fill { height: 100%; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <header className="bg-red-700/10 backdrop-blur-md border-b border-white/5 px-6 py-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => view === 'details' ? setView('gallery') : navigate('/')} 
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-red-500 transition-all border border-white/5 shadow-xl"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-widest uppercase italic leading-none">Pokédex</h1>
            <p className="text-[8px] text-gray-500 uppercase tracking-[0.4em] font-bold mt-1.5">National_Archive // v2.5.2</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Database_Status</p>
            <p className="text-[10px] font-black text-emerald-500 uppercase italic">Linked</p>
          </div>
          <div className="w-10 h-10 bg-blue-400 rounded-full border-2 border-white shadow-[0_0_20px_rgba(96,165,250,0.6)] animate-pulse" />
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-12 relative z-10 max-w-7xl mx-auto w-full">
        {view === 'gallery' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-in fade-in duration-700">
            {pokemonList.map(p => (
              <button
                key={p.id}
                onClick={() => handleOpenDetails(p)}
                className="group pokedex-glass p-6 rounded-[2.5rem] flex flex-col items-center gap-6 hover:bg-white/[0.05] transition-all hover:-translate-y-2 active:scale-95 shadow-2xl border-white/5"
              >
                <div className="w-24 h-24 relative">
                  <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />
                  <LazyImage 
                    src={p.sprite}
                    alt={p.name}
                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-500"
                    placeholderColor="bg-transparent"
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[9px] font-black text-red-500 tracking-[0.2em]">#{String(p.id).padStart(3, '0')}</p>
                  <p className="text-xs font-black uppercase tracking-tight truncate w-28 group-hover:text-red-400 transition-colors italic">{p.name.replace(/-/g, ' ')}</p>
                  <div className="flex justify-center gap-1 mt-2">
                    {p.types.map(t => (
                      <span key={t} className="text-[6px] font-black uppercase px-1.5 py-0.5 bg-white/5 rounded-full text-gray-500">{t}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-8 duration-700">
            {selectedPokemon && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5 space-y-8">
                  <div className="pokedex-glass rounded-[3.5rem] p-12 relative overflow-hidden group border-white/10 shadow-[0_0_100px_rgba(239,68,68,0.05)]">
                    <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none" />
                    
                    <div className="flex justify-between items-start mb-12 relative z-10">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-red-500 tracking-[0.5em] uppercase">Biological_Archive</span>
                        <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none text-white drop-shadow-2xl">{selectedPokemon.name.replace(/-/g, ' ')}</h2>
                      </div>
                      <button 
                        onClick={() => setIsShiny(!isShiny)}
                        className={`p-4 rounded-[1.5rem] border transition-all ${isShiny ? 'bg-yellow-500 border-yellow-400 text-black shadow-[0_0_30px_rgba(234,179,8,0.5)]' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
                      >
                        <Sparkles size={24} className={isShiny ? 'animate-pulse' : ''} />
                      </button>
                    </div>

                    <div className="relative h-80 flex items-center justify-center">
                      <div className="absolute inset-0 bg-red-500/10 blur-[100px] rounded-full animate-pulse" />
                      <LazyImage 
                        src={isShiny ? selectedPokemon.shinySprite : selectedPokemon.sprite}
                        alt={selectedPokemon.name}
                        className="w-64 h-64 object-contain relative z-10 drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                        placeholderColor="bg-transparent"
                      />
                    </div>

                    <div className="flex justify-center gap-4 mt-12">
                      {selectedPokemon.types.map(t => (
                        <span key={t} className="px-8 py-2.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-xl">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="pokedex-glass p-8 rounded-[2rem] space-y-2 text-center border-white/5 group hover:bg-white/[0.02] transition-all">
                      <Ruler size={14} className="mx-auto text-gray-600 mb-2" />
                      <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">Height</p>
                      <p className="text-xl font-black italic tracking-tighter text-white">{selectedPokemon.height / 10}m</p>
                    </div>
                    <div className="pokedex-glass p-8 rounded-[2rem] space-y-2 text-center border-white/5 group hover:bg-white/[0.02] transition-all">
                      <Weight size={14} className="mx-auto text-gray-600 mb-2" />
                      <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">Weight</p>
                      <p className="text-xl font-black italic tracking-tighter text-white">{selectedPokemon.weight / 10}kg</p>
                    </div>
                    <div className="pokedex-glass p-6 rounded-[2rem] flex items-center justify-center group border-white/5 hover:bg-white/[0.02] transition-all">
                      <LazyImage src={selectedPokemon.footprint} alt="footprint" className="h-16 grayscale invert filter brightness-200 opacity-20 group-hover:opacity-80 transition-opacity" placeholderColor="bg-transparent" />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-12">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 border-l-2 border-red-500 pl-6">
                      <BookOpen size={20} className="text-red-500" />
                      <h3 className="text-sm font-black uppercase tracking-[0.4em]">Historical Log</h3>
                    </div>
                    <p className="text-base leading-relaxed text-gray-400 font-medium uppercase italic bg-white/[0.02] p-10 rounded-[3rem] border border-white/5 shadow-inner">{selectedPokemon.description}</p>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center gap-4 border-l-2 border-red-500 pl-6">
                      <BarChart2 size={20} className="text-red-500" />
                      <h3 className="text-sm font-black uppercase tracking-[0.4em]">Neural Matrix</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8">
                      {selectedPokemon.stats.map(s => (
                        <div key={s.name} className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <span className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${getStatColor(s.name)}`} /> {s.name.replace('special-', 'sp.')}</span>
                            <span className="text-white italic">{s.value}</span>
                          </div>
                          <div className="stat-bar border border-white/5">
                            <div style={{ width: `${(s.value / 255) * 100}%` }} className={`stat-fill ${getStatColor(s.name)} shadow-[0_0_15px_rgba(255,255,255,0.1)]`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center gap-4 border-l-2 border-red-500 pl-6">
                      <Dna size={20} className="text-red-500" />
                      <h3 className="text-sm font-black uppercase tracking-[0.4em]">Tactical Movesets</h3>
                    </div>
                    <div className="space-y-6">
                      <div className="relative">
                        <select 
                          onChange={(e) => setSelectedVersionGroup(e.target.value)} 
                          value={selectedVersionGroup} 
                          className="w-full bg-white/5 border border-white/10 p-5 rounded-[1.5rem] font-mono text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-red-500/50 transition-all appearance-none text-white shadow-xl cursor-pointer"
                        >
                          {Object.keys(selectedPokemon.moves).map(vg => (<option key={vg} value={vg} className="bg-[#0a0a0a]">{vg.replace(/-/g, ' ')}</option>))}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20"><Box size={18} /></div>
                      </div>
                      <div className="bg-black/40 rounded-[3rem] p-10 h-80 overflow-y-auto border border-white/5 scrollbar-hide shadow-inner">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {selectedPokemon.moves[selectedVersionGroup]?.map(move => (
                            <span key={move} className="text-[10px] font-black text-gray-600 uppercase tracking-tighter truncate py-3 px-4 bg-white/5 rounded-2xl border border-white/[0.02] hover:text-white hover:bg-white/[0.08] transition-all cursor-default text-center">{move}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 px-8 py-5 flex justify-between items-center bg-black/80 backdrop-blur-3xl border-t border-white/5 text-gray-700 z-50">
        <div className="flex items-center gap-6">
          <span className="text-[9px] font-mono uppercase tracking-widest italic flex items-center gap-2">
            <LayoutGrid size={12} className="text-red-900" /> 
            Sector: Favourite_Archives
          </span>
          <span className="hidden md:inline text-gray-900">|</span>
          <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-500/40 italic">Linked: PokeAPI_v2_Stable</span>
        </div>
        <div className="flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <div className="w-1.5 h-1.5 rounded-full bg-red-900" />
        </div>
      </footer>
    </div>
  );
};

export default PokedexApp;
