import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Dna, Footprints, BarChart2, 
  BookOpen, RefreshCcw, Search, ChevronLeft, 
  ChevronRight, Sparkles, Box
} from 'lucide-react';
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
  const [view, setView] = useState('gallery'); // 'gallery' or 'details'
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const [isShiny, setIsShiny] = useState(false);
  const [selectedVersionGroup, setSelectedVersionGroup] = useState('');

  // Fetch basic list on mount
  useEffect(() => {
    const initList = async () => {
      setLoading(true);
      try {
        const promises = FAVORITE_POKEMON.map(name => 
          fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => res.json())
        );
        const results = await Promise.all(promises);
        setPokemonList(results.sort((a, b) => a.id - b.id));
      } catch (err) {
        console.error('PokeAPI List Error:', err);
        setError("Failed to sync database.");
      } finally {
        setLoading(false);
      }
    };
    initList();
  }, []);

  const handleOpenDetails = useCallback(async (pokemon) => {
    setLoadingDetails(true);
    setView('details');
    setIsShiny(false);
    try {
      const speciesRes = await fetch(pokemon.species.url);
      const speciesJson = await speciesRes.json();

      const description = speciesJson.flavor_text_entries
        .find(entry => entry.language.name === 'en')
        ?.flavor_text.replace(/[\n\f]/g, ' ') || "No biological data found.";

      const movesByGen = pokemon.moves.reduce((acc, move) => {
        move.version_group_details.forEach(detail => {
          const genName = detail.version_group.name;
          if (!acc[genName]) acc[genName] = [];
          acc[genName].push(move.move.name.replace(/-/g, ' '));
        });
        return acc;
      }, {});

      const processed = {
        ...pokemon,
        description,
        movesByGen,
        spriteBase: pokemon.name.replace('-disguised', '').replace('-galar', '').replace('-shield', ''),
        footprint: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/footprints/${pokemon.id}.png`
      };

      setSelectedPokemon(processed);
      const versions = Object.keys(movesByGen);
      if (versions.length > 0) setSelectedVersionGroup(versions[0]);

    } catch (err) {
      console.error('PokeAPI Detail Error:', err);
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-red-500 font-mono gap-4">
      <RefreshCcw className="animate-spin" size={32} />
      <span className="tracking-[0.5em] animate-pulse uppercase text-[10px] font-bold">Initializing Sync...</span>
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

      {/* Header */}
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
            <p className="text-[8px] text-gray-500 uppercase tracking-[0.4em] font-bold mt-1.5">Favorite_Archive // v2.5.2</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Database_Status</p>
            <p className="text-[10px] font-black text-emerald-500 uppercase italic">Online</p>
          </div>
          <div className="w-10 h-10 bg-blue-400 rounded-full border-2 border-white shadow-[0_0_20px_rgba(96,165,250,0.6)] animate-pulse" />
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-12 relative z-10 max-w-7xl mx-auto w-full">
        {view === 'gallery' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-in fade-in duration-700">
            {pokemonList.map(p => (
              <button
                key={p.id}
                onClick={() => handleOpenDetails(p)}
                className="group pokedex-glass p-4 rounded-[2rem] flex flex-col items-center gap-4 hover:bg-white/[0.05] transition-all hover:-translate-y-1 active:scale-95"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/10 blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                  <img 
                    src={`https://play.pokemonshowdown.com/sprites/gen5ani/${p.name.replace(/-disguised|-galar|-shield/g,'')}.gif`}
                    alt={p.name}
                    className="w-20 h-20 object-contain relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = p.sprites.front_default }}
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[8px] font-black text-red-500 tracking-widest">#{String(p.id).padStart(3, '0')}</p>
                  <p className="text-[10px] font-black uppercase tracking-tighter truncate w-24 group-hover:text-red-400 transition-colors">{p.name.replace(/-/g, ' ')}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-8 duration-700">
            {loadingDetails ? (
              <div className="flex flex-col items-center justify-center py-40 opacity-50 gap-4">
                <RefreshCcw className="animate-spin text-red-500" size={32} />
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">Decompressing Biological Data...</p>
              </div>
            ) : selectedPokemon && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Visual Module */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="pokedex-glass rounded-[3rem] p-12 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none" />
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-red-500 tracking-[0.5em] uppercase">Archive_Entry</span>
                        <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{selectedPokemon.name.replace(/-/g, ' ')}</h2>
                      </div>
                      <button 
                        onClick={() => setIsShiny(!isShiny)}
                        className={`p-3 rounded-2xl border transition-all ${isShiny ? 'bg-yellow-500 border-yellow-400 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
                      >
                        <Sparkles size={20} />
                      </button>
                    </div>

                    <div className="relative h-64 flex items-center justify-center">
                      <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full animate-pulse" />
                      <img 
                        src={`https://play.pokemonshowdown.com/sprites/gen5ani${isShiny ? '-shiny' : ''}/${selectedPokemon.spriteBase}.gif`}
                        alt={selectedPokemon.name}
                        className="w-48 h-48 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                      />
                    </div>

                    <div className="flex justify-center gap-4 mt-8">
                      {selectedPokemon.types.map(t => (
                        <span key={t.type.name} className="px-6 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{t.type.name}</span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="pokedex-glass p-6 rounded-3xl space-y-1 text-center">
                      <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Dimension</p>
                      <p className="text-lg font-black italic tracking-tighter">{selectedPokemon.height / 10}m</p>
                    </div>
                    <div className="pokedex-glass p-6 rounded-3xl space-y-1 text-center">
                      <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Mass</p>
                      <p className="text-lg font-black italic tracking-tighter">{selectedPokemon.weight / 10}kg</p>
                    </div>
                    <div className="pokedex-glass p-4 rounded-3xl flex items-center justify-center group">
                      <img src={selectedPokemon.footprint} alt="footprint" className="h-12 opacity-20 group-hover:opacity-60 transition-opacity grayscale invert" />
                    </div>
                  </div>
                </div>

                {/* Data Module */}
                <div className="lg:col-span-7 space-y-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 border-l-2 border-red-500 pl-4">
                      <BookOpen size={16} className="text-red-500" />
                      <h3 className="text-sm font-black uppercase tracking-[0.3em]">Biological Log</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-400 font-medium uppercase italic bg-white/[0.02] p-6 rounded-[2rem] border border-white/5">{selectedPokemon.description}</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-l-2 border-red-500 pl-4">
                      <BarChart2 size={16} className="text-red-500" />
                      <h3 className="text-sm font-black uppercase tracking-[0.3em]">Neural Matrix</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                      {selectedPokemon.stats.map(s => (
                        <div key={s.stat.name} className="space-y-2">
                          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-500">
                            <span>{s.stat.name.replace('special-', 'sp.')}</span>
                            <span className="text-white">{s.base_stat}</span>
                          </div>
                          <div className="stat-bar">
                            <div style={{ width: `${(s.base_stat / 200) * 100}%` }} className="stat-fill bg-gradient-to-r from-red-600 to-yellow-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-l-2 border-red-500 pl-4">
                      <Dna size={16} className="text-red-500" />
                      <h3 className="text-sm font-black uppercase tracking-[0.3em]">Tactical Data</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="relative">
                        <select 
                          onChange={(e) => setSelectedVersionGroup(e.target.value)} 
                          value={selectedVersionGroup} 
                          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl font-mono text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors appearance-none"
                        >
                          {Object.keys(selectedPokemon.movesByGen).map(vg => (<option key={vg} value={vg} className="bg-black">{vg}</option>))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20"><Box size={14} /></div>
                      </div>
                      <div className="bg-black/40 rounded-[2rem] p-6 h-64 overflow-y-auto border border-white/5 scrollbar-hide shadow-inner">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {selectedPokemon.movesByGen[selectedVersionGroup]?.map(move => (
                            <span key={move} className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter truncate py-2 px-3 bg-white/5 rounded-xl border border-white/[0.02]">{move}</span>
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

      {/* Footer Info */}
      <footer className="fixed bottom-0 left-0 right-0 px-6 py-4 flex justify-between items-center bg-black/60 backdrop-blur-xl border-t border-white/5 text-gray-700 z-50">
        <span className="text-[8px] font-mono uppercase tracking-widest italic">Core_Link: Stable // PokéAPI_v2</span>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
        </div>
      </footer>
    </div>
  );
};

export default PokedexApp;
