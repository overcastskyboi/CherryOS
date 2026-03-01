import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dna, Footprints, Ruler, Weight, BarChart2, BookOpen, RefreshCcw } from 'lucide-react';
import LazyImage from '../components/LazyImage';

const FAVORITE_POKEMON = [
  'gengar', 'mimikyu-disguised', 'scizor', 'chimecho', 'meganium', 'shuckle', 
  'jirachi', 'celebi', 'swampert', 'tyranitar', 'snorlax', 'mienshao', 'raikou', 
  'zapdos', 'regice', 'lugia', 'espeon', 'altaria', 'skarmory', 'heracross', 
  'cofagrigus', 'corsola-galar', 'kabutops', 'genesect', 'ampharos', 'politoed', 
  'hitmontop', 'cradily', 'milotic', 'metagross', 'latias', 'magnezone', 
  'togekiss', 'rotom', 'gliscor', 'aegislash-shield', 'goodra', 'flamigo'
];

const PokedexApp = () => {
  const navigate = useNavigate();
  const [pokemonData, setPokemonData] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [speciesData, setSpeciesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVersionGroup, setSelectedVersionGroup] = useState('');

  const fetchPokemonDetails = async (name) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  };

  const fetchAllPokemon = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use Promise.allSettled for resilience
      const results = await Promise.allSettled(FAVORITE_POKEMON.map(name => fetchPokemonDetails(name)));
      const successfulData = results
        .filter(r => r.status === 'fulfilled' && r.value !== null)
        .map(r => r.value)
        .sort((a, b) => a.id - b.id);

      if (successfulData.length === 0) throw new Error("No data retrieved");
      
      setPokemonData(successfulData);
      if (successfulData.length > 0) {
        handleSelectPokemon(successfulData[0]);
      }
    } catch (e) {
      setError("Network error: Failed to reach PokéAPI.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectPokemon = useCallback(async (pokemon) => {
    setSelectedPokemon(pokemon);
    setSpeciesData(null);
    setSelectedVersionGroup('');
    try {
      const speciesRes = await fetch(pokemon.species.url);
      const speciesJson = await speciesRes.json();
      setSpeciesData(speciesJson);
    } catch (e) {
      console.warn("Species metadata unavailable.");
    }
  }, []);
  
  useEffect(() => {
    fetchAllPokemon();
  }, [fetchAllPokemon]);
  
  const flavorText = useMemo(() => {
    if (!speciesData) return "Scanning biological signatures...";
    const englishEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
    return englishEntry ? englishEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') : "No classification data found.";
  }, [speciesData]);
  
  const movesByVersion = useMemo(() => {
    if (!selectedPokemon) return {};
    const moves = selectedPokemon.moves.reduce((acc, move) => {
      move.version_group_details.forEach(detail => {
        const vg = detail.version_group.name;
        if (!acc[vg]) acc[vg] = [];
        acc[vg].push(move.move.name);
      });
      return acc;
    }, {});
    
    if (!selectedVersionGroup && Object.keys(moves).length > 0) {
      setSelectedVersionGroup(Object.keys(moves)[0]);
    }
    return moves;
  }, [selectedPokemon, selectedVersionGroup]);

  return (
    <div className="min-h-[100dvh] bg-red-950/40 text-white flex flex-col font-mono animate-elegant">
      <style>{`
        .pokedex-screen { background: rgba(10, 10, 10, 0.8); border: 2px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); }
        .stat-bar { background: rgba(255,255,255,0.05); height: 6px; border-radius: 3px; overflow: hidden; }
        .stat-fill { height: 100%; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>

      <header className="bg-red-700/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black tracking-widest uppercase italic">Pokédex</h1>
        </div>
        <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white shadow-[0_0_15px_rgba(96,165,250,0.8)] animate-pulse" />
      </header>

      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden relative z-10">
        {/* Left Pane: List */}
        <div className="w-full md:w-80 flex flex-col pokedex-screen rounded-2xl p-2 overflow-y-auto border border-white/5 shadow-inner">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
              <RefreshCcw className="animate-spin" size={24} />
              <span className="text-[10px] font-bold tracking-widest uppercase">Syncing Database</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center space-y-4">
              <p className="text-xs font-bold text-red-400 uppercase leading-relaxed">{error}</p>
              <button onClick={fetchAllPokemon} className="px-4 py-2 bg-red-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">Retry</button>
            </div>
          ) : (
            <div className="space-y-1">
              {pokemonData.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPokemon(p)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${selectedPokemon?.id === p.id ? 'bg-red-600/40 border border-white/20' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <img src={p.sprites.front_default} alt={p.name} className="w-10 h-10" />
                  <div className="text-left">
                    <p className="text-[8px] font-bold text-red-400">#{String(p.id).padStart(3, '0')}</p>
                    <p className="text-[10px] font-black uppercase tracking-tight">{p.name.replace('-disguised', '')}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Pane: Details */}
        <div className="flex-1 flex flex-col pokedex-screen rounded-2xl p-8 overflow-y-auto relative border border-white/5">
          {selectedPokemon ? (
            <div className="max-w-3xl mx-auto w-full space-y-10 animate-in fade-in duration-700">
              <div className="flex flex-col sm:flex-row items-center gap-10">
                <div className="relative group">
                  <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse" />
                  <div className="relative w-40 h-40 bg-black/40 rounded-full border-4 border-white/10 flex items-center justify-center p-4 backdrop-blur-3xl">
                    <img 
                      src={`https://play.pokemonshowdown.com/sprites/gen5ani/${selectedPokemon.name.replace(/-galar|-shield/g,'')}.gif`}
                      alt={selectedPokemon.name}
                      className="w-28 h-28 object-contain"
                    />
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-red-500 tracking-[0.5em] uppercase">Identification</span>
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{selectedPokemon.name.replace(/-disguised|-galar|-shield/g, ' ')}</h2>
                  </div>
                  <div className="flex justify-center sm:justify-start gap-2">
                    {selectedPokemon.types.map(t => (
                      <span key={t.type.name} className="px-4 py-1 bg-white/10 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest">{t.type.name}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                  <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Dimension</p>
                  <p className="text-sm font-black italic tracking-tighter">{selectedPokemon.height / 10}m</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                  <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Mass</p>
                  <p className="text-sm font-black italic tracking-tighter">{selectedPokemon.weight / 10}kg</p>
                </div>
                <div className="bg-white/5 p-2 rounded-2xl border border-white/5 flex items-center justify-center">
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/footprints/${selectedPokemon.id}.png`} alt="footprint" className="h-10 opacity-40 grayscale invert" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 border-l-2 border-red-500 pl-4">
                  <BookOpen size={14} className="text-red-500" />
                  <h3 className="text-xs font-black uppercase tracking-[0.3em]">Species Log</h3>
                </div>
                <p className="text-xs leading-relaxed text-gray-300 font-medium uppercase italic">{flavorText}</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 border-l-2 border-red-500 pl-4">
                  <BarChart2 size={14} className="text-red-500" />
                  <h3 className="text-xs font-black uppercase tracking-[0.3em]">Performance Matrix</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                  {selectedPokemon.stats.map(s => (
                    <div key={s.stat.name} className="space-y-1">
                      <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500">
                        <span>{s.stat.name.replace('special-', 'sp.')}</span>
                        <span className="text-white">{s.base_stat}</span>
                      </div>
                      <div className="stat-bar">
                        <div style={{ width: `${(s.base_stat / 200) * 100}%` }} className="stat-fill bg-gradient-to-r from-red-600 to-yellow-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 border-l-2 border-red-500 pl-4">
                  <Dna size={14} className="text-red-500" />
                  <h3 className="text-xs font-black uppercase tracking-[0.3em]">Available Moves</h3>
                </div>
                <div className="space-y-4">
                  <select 
                    onChange={(e) => setSelectedVersionGroup(e.target.value)} 
                    value={selectedVersionGroup} 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl font-mono text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors"
                  >
                    {Object.keys(movesByVersion).map(vg => (<option key={vg} value={vg}>{vg}</option>))}
                  </select>
                  <div className="bg-black/40 rounded-2xl p-4 max-h-48 overflow-y-auto border border-white/5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {movesByVersion[selectedVersionGroup]?.map(move => (
                        <span key={move} className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter truncate">{move.replace(/-/g, ' ')}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 opacity-20">
              <Dna size={80} />
              <p className="text-sm font-black uppercase tracking-[0.5em] mt-4">Database Standby</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PokedexApp;
