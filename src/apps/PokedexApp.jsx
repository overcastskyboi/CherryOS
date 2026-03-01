import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dna, Footprints, BarChart2, BookOpen, RefreshCcw, Search } from 'lucide-react';

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
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVersionGroup, setSelectedVersionGroup] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch basic list on mount
  useEffect(() => {
    const initList = async () => {
      setLoading(true);
      try {
        const promises = FAVORITE_POKEMON.map(name => 
          fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => res.json())
        );
        const results = await Promise.all(promises);
        const sorted = results.sort((a, b) => a.id - b.id);
        setPokemonList(sorted);
        if (sorted.length > 0) handleSelectPokemon(sorted[0].name);
      } catch (err) {
        console.error('PokeAPI Fetch Error:', err);
        setError("Failed to initialize Pokedex list.");
      } finally {
        setLoading(false);
      }
    };
    initList();
  }, []);

  const handleSelectPokemon = useCallback(async (name) => {
    setLoadingDetails(true);
    try {
      const [pokemonRes, speciesRes] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => {
          if(!res.ok) throw new Error(`Pokemon API error: ${res.status}`);
          return res.json();
        }),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${name.replace('-disguised', '').replace('-galar', '').replace('-shield', '')}`).then(res => {
          if(!res.ok) throw new Error(`Species API error: ${res.status}`);
          return res.json();
        })
      ]);

      // 1. Map description
      const description = speciesRes.flavor_text_entries
        .find(entry => entry.language.name === 'en')
        ?.flavor_text.replace(/[\n\f]/g, ' ') || "No data found.";

      // 2. Map moves by generation
      const movesByGen = pokemonRes.moves.reduce((acc, move) => {
        move.version_group_details.forEach(detail => {
          const genName = detail.version_group.name;
          if (!acc[genName]) acc[genName] = [];
          acc[genName].push(move.move.name.replace(/-/g, ' '));
        });
        return acc;
      }, {});

      const processed = {
        id: pokemonRes.id,
        name: pokemonRes.name,
        height: pokemonRes.height,
        weight: pokemonRes.weight,
        stats: pokemonRes.stats,
        types: pokemonRes.types,
        description,
        movesByGen,
        sprite: `https://play.pokemonshowdown.com/sprites/gen5ani/${pokemonRes.name.replace('-disguised', '').replace('-galar', '').replace('-shield', '')}.gif`,
        footprint: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/footprints/${pokemonRes.id}.png`
      };

      setSelectedPokemon(processed);
      const versions = Object.keys(movesByGen);
      if (versions.length > 0) setSelectedVersionGroup(versions[0]);

    } catch (err) {
      console.error('PokeAPI Fetch Error:', err);
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  const filteredPokemon = useMemo(() => {
    return pokemonList.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [pokemonList, searchQuery]);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-red-500 font-mono">INITIALIZING_POKEDEX_SYNC...</div>;

  return (
    <div className="min-h-[100dvh] bg-red-950/40 text-white flex flex-col font-mono animate-elegant">
      <header className="bg-red-700/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between shadow-2xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black tracking-widest uppercase italic text-white">Pokédex</h1>
        </div>
        <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white shadow-[0_0_15px_rgba(96,165,250,0.8)] animate-pulse" />
      </header>

      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden relative z-10">
        {/* Left Pane: Navigator */}
        <div className="w-full md:w-80 flex flex-col bg-black/60 rounded-2xl p-4 border border-white/5 shadow-inner">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search index..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase text-white focus:outline-none focus:border-red-500 transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-2">
            {filteredPokemon.map(p => (
              <button
                key={p.id}
                onClick={() => handleSelectPokemon(p.name)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${selectedPokemon?.name === p.name ? 'bg-red-600/40 border border-white/20' : 'hover:bg-white/5 border border-transparent'}`}
              >
                <img src={p.sprites.front_default} alt={p.name} className="w-10 h-10 drop-shadow-lg" />
                <div className="text-left">
                  <p className="text-[8px] font-bold text-red-400">#{String(p.id).padStart(3, '0')}</p>
                  <p className="text-[10px] font-black uppercase tracking-tight">{p.name.replace(/-/g, ' ')}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane: Processor */}
        <div className="flex-1 flex flex-col bg-black/60 rounded-2xl p-8 overflow-y-auto relative border border-white/5 shadow-2xl">
          {loadingDetails ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50 gap-4">
              <RefreshCcw className="animate-spin text-red-500" size={32} />
              <p className="text-xs font-black uppercase tracking-widest">Processing Data...</p>
            </div>
          ) : selectedPokemon ? (
            <div className="max-w-3xl mx-auto w-full space-y-10 animate-in fade-in duration-700">
              <div className="flex flex-col sm:flex-row items-center gap-10">
                <div className="relative group">
                  <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse" />
                  <div className="relative w-40 h-40 bg-black/40 rounded-full border-4 border-white/10 flex items-center justify-center p-4 backdrop-blur-3xl">
                    <img 
                      src={selectedPokemon.sprite}
                      alt={selectedPokemon.name}
                      className="w-28 h-28 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                      onError={(e) => { e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemon.id}.png` }}
                    />
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-red-500 tracking-[0.5em] uppercase">Identification</span>
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{selectedPokemon.name.replace(/-/g, ' ')}</h2>
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
                  <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest text-center">Dimension</p>
                  <p className="text-sm font-black italic tracking-tighter text-center">{selectedPokemon.height / 10}m</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                  <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest text-center">Mass</p>
                  <p className="text-sm font-black italic tracking-tighter text-center">{selectedPokemon.weight / 10}kg</p>
                </div>
                <div className="bg-white/5 p-2 rounded-2xl border border-white/5 flex items-center justify-center">
                  <img src={selectedPokemon.footprint} alt="footprint" className="h-10 opacity-40 grayscale invert" onError={(e) => e.target.style.display='none'} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 border-l-2 border-red-500 pl-4">
                  <BookOpen size={14} className="text-red-500" />
                  <h3 className="text-xs font-black uppercase tracking-[0.3em]">Species Log</h3>
                </div>
                <p className="text-xs leading-relaxed text-gray-300 font-medium uppercase italic bg-black/20 p-4 rounded-xl border border-white/5">{selectedPokemon.description}</p>
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
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div style={{ width: `${(s.base_stat / 200) * 100}%` }} className="h-full bg-gradient-to-r from-red-600 to-yellow-500 shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all duration-1000" />
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
                    className="w-full bg-black border border-white/10 p-3 rounded-xl font-mono text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-red-500 transition-colors"
                  >
                    {Object.keys(selectedPokemon.movesByGen).map(vg => (<option key={vg} value={vg}>{vg}</option>))}
                  </select>
                  <div className="bg-black/40 rounded-2xl p-4 max-h-48 overflow-y-auto border border-white/5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedPokemon.movesByGen[selectedVersionGroup]?.map(move => (
                        <span key={move} className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter truncate">{move}</span>
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
