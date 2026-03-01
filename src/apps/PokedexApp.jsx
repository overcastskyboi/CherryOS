import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dna, Footprints, Ruler, Weight, BarChart2, BookOpen } from 'lucide-react';
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

  const fetchAllPokemon = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const promises = FAVORITE_POKEMON.map(name => 
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => res.json())
      );
      const results = await Promise.all(promises);
      setPokemonData(results.sort((a, b) => a.id - b.id));
      if (results.length > 0) {
        handleSelectPokemon(results[0]);
      }
    } catch (e) {
      setError("Failed to load Pokédex data.");
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
      // species fetch fail
    }
  }, []);
  
  useEffect(() => {
    fetchAllPokemon();
  }, [fetchAllPokemon]);
  
  const flavorText = useMemo(() => {
    if (!speciesData) return "No description available.";
    const englishEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
    return englishEntry ? englishEntry.flavor_text.replace(/\f/g, ' ') : "No description available.";
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
    <div className="min-h-[100dvh] bg-red-900/90 text-white flex flex-col font-mono">
      <style>{`
        .pokedex-screen { background: #222; border: 4px solid #444; box-shadow: inset 0 0 15px rgba(0,0,0,0.5); }
        .stat-bar > div { transition: width 0.5s ease-out; }
      `}</style>

      <header className="bg-red-700 border-b-4 border-red-800 px-6 py-4 flex items-center justify-between shadow-lg">
        <button onClick={() => navigate('/')} className="p-2 bg-red-800 hover:bg-red-900 rounded-full text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold tracking-wider uppercase">Pokédex</h1>
        <div className="w-10 h-10 bg-blue-400 rounded-full border-4 border-white animate-pulse" />
      </header>

      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
        <div className="w-full md:w-1/3 flex flex-col pokedex-screen rounded-lg p-2 overflow-y-auto">
          {loading && <p>Loading Pokémon...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {pokemonData.map(p => (
            <button key={p.id} onClick={() => handleSelectPokemon(p)}
              className={`flex items-center gap-4 p-2 rounded-md hover:bg-red-600 transition-colors ${selectedPokemon?.id === p.id ? 'bg-red-700' : ''}`}>
              <img src={p.sprites.front_default} alt={p.name} className="w-12 h-12" />
              <span className="capitalize font-bold text-sm">#{String(p.id).padStart(3, '0')} {p.name.replace('-disguised', '')}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col pokedex-screen rounded-lg p-6 overflow-y-auto">
          {selectedPokemon ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="bg-black/20 p-4 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                  <img src={`https://play.pokemonshowdown.com/sprites/gen5ani/${selectedPokemon.name.replace(/-galar|-shield/g,'')}.gif`} alt={selectedPokemon.name} className="w-24 h-24" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold capitalize tracking-wider">{selectedPokemon.name.replace(/-disguised|-galar|-shield/g, ' ')}</h2>
                  <div className="flex gap-2 mt-2">
                    {selectedPokemon.types.map(t => (
                      <span key={t.type.name} className="px-3 py-1 bg-gray-600 text-xs rounded-full uppercase font-bold">{t.type.name}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-black/20 p-3 rounded-lg"><p className="text-xs text-gray-400">Height</p><p className="font-bold">{selectedPokemon.height / 10} m</p></div>
                <div className="bg-black/20 p-3 rounded-lg"><p className="text-xs text-gray-400">Weight</p><p className="font-bold">{selectedPokemon.weight / 10} kg</p></div>
                <div className="bg-black/20 p-3 rounded-lg col-span-2 md:col-span-1"><p className="text-xs text-gray-400">Footprint</p><img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/footprints/${selectedPokemon.id}.png`} alt="footprint" className="mx-auto mt-1" /></div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><BookOpen size={16}/> Pokédex Entry</h3>
                <p className="text-sm leading-relaxed">{flavorText}</p>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><BarChart2 size={16}/> Base Stats</h3>
                <div className="space-y-2">
                  {selectedPokemon.stats.map(s => (
                    <div key={s.stat.name} className="grid grid-cols-3 items-center">
                      <span className="text-xs uppercase col-span-1">{s.stat.name.replace('special-', 'sp.')}</span>
                      <div className="col-span-2 stat-bar rounded-full bg-gray-700">
                        <div style={{ width: `${(s.base_stat / 255) * 100}%` }} className="h-4 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full text-right pr-2 text-black text-xs font-bold">{s.base_stat}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Dna size={16}/> Moveset</h3>
                <select onChange={(e) => setSelectedVersionGroup(e.target.value)} value={selectedVersionGroup} className="w-full bg-gray-700 p-2 rounded-md font-mono">
                  {Object.keys(movesByVersion).map(vg => (<option key={vg} value={vg}>{vg}</option>))}
                </select>
                <div className="pokedex-screen mt-2 p-2 rounded-md max-h-48 overflow-y-auto">
                  <p className="text-xs grid grid-cols-2 sm:grid-cols-3 gap-1">
                    {movesByVersion[selectedVersionGroup]?.map(move => (<span key={move}>{move}</span>))}
                  </p>
                </div>
              </div>
            </div>
          ) : (<p>Select a Pokémon from the list.</p>)}
        </div>
      </main>
    </div>
  );
};

export default PokedexApp;
