import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Papa from 'papaparse';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { 
  TrendingUp, DollarSign, Package, ArrowLeft, RefreshCcw, 
  Search, Filter, Gamepad2, Trophy, Sparkles, Sword, 
  Cpu, Disc, Smartphone, Book, 
  Layers, Zap, Flame, Droplet, Leaf, Ghost, Skull
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_MAP = {
  'Video Games': { color: '#3b82f6', icon: Gamepad2 },
  'Basketball Cards': { color: '#f97316', icon: Trophy },
  'Pokemon Cards': { color: '#ef4444', icon: Sparkles },
  'YuGiOh Cards': { color: '#8b5cf6', icon: Sword },
  'Other': { color: '#6b7280', icon: Package }
};

const SPECIFIC_ICON_MAP = {
  'gamecube': Disc,
  'nintendo ds': Smartphone,
  'nintendo 64': Cpu,
  'gameboy advance': Smartphone,
  'playstation': Disc,
  'strategy guide': Book,
  'wii': Disc,
  'switch': Smartphone,
  'nes': Cpu,
  'snes': Cpu,
  'crown zenith': Sparkles,
  'shining fates': Zap,
  'hidden fates': Ghost,
  'silver tempest': Droplet,
  'obsidian flames': Flame,
  'scarlet & violet': Leaf,
  'promo': Sparkles,
  'base set': Layers,
  'pegasus': Sword,
  'kaiba': Zap,
  'yugi': Sword,
  'joey': Flame,
  'metal raiders': Skull,
  'dark crisis': Skull,
  'prizm': Trophy,
  'donruss': Trophy,
  'topps': Trophy,
};

const getBroadCategory = (specific) => {
  const s = specific?.toLowerCase() || '';
  if (s.includes('pokemon')) return 'Pokemon Cards';
  if (s.includes('yugioh')) return 'YuGiOh Cards';
  if (s.includes('basketball')) return 'Basketball Cards';
  const consoles = ['gamecube', 'nintendo ds', 'gameboy advance', 'nintendo 64', 'playstation', 'strategy guide', 'wii', 'switch', 'nes', 'snes', 'xbox'];
  if (consoles.some(c => s.includes(c))) return 'Video Games';
  return 'Other';
};

const cleanSetName = (name) => {
  if (!name) return 'Unknown';
  return name
    .replace(/^Pokemon\s+/i, '')
    .replace(/^YuGiOh\s+/i, '')
    .replace(/^Basketball Cards\s+/i, '')
    .trim();
};

import { useOS } from '../context/OSContext';

export default function CollectionTrackerApp() {
  const navigate = useNavigate();
  const { setThemeColor } = useOS();

  useEffect(() => {
    setThemeColor('#f59e0b'); // Amber
  }, [setThemeColor]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveTab] = useState('All');

  const fetchAndParseCSV = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/collection.csv');
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          // De-duplicate by ID
          const seenIds = new Set();
          const processed = results.data
            .filter(row => {
              if (!row.id || seenIds.has(row.id)) return false;
              seenIds.add(row.id);
              return true;
            })
            .map(row => {
              const rawSet = row['console-name'] || 'Uncategorized';
              return {
                id: row.id,
                name: row['product-name'],
                specificSet: cleanSetName(rawSet),
                broadCategory: getBroadCategory(rawSet),
                value: (row['price-in-pennies'] || 0) / 100,
                quantity: row.quantity || 1,
                date: row['date-entered']
              };
            });
          setData(processed);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Vault Access Failed:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndParseCSV();
  }, [fetchAndParseCSV]);

  const categories = useMemo(() => ['All', ...Object.keys(CATEGORY_MAP)], []);

  const filteredAndSorted = useMemo(() => {
    return data
      .filter(item => {
        const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = activeCategory === 'All' || item.broadCategory === activeCategory;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => b.value - a.value); 
  }, [data, searchQuery, activeCategory]);

  const stats = useMemo(() => {
    const total = filteredAndSorted.reduce((acc, curr) => acc + (curr.value * curr.quantity), 0);
    const count = filteredAndSorted.length;
    return { total, count };
  }, [filteredAndSorted]);

  const chartData = useMemo(() => {
    const aggregates = data.reduce((acc, item) => {
      const cat = item.broadCategory;
      if (!acc[cat]) acc[cat] = 0;
      acc[cat] += (item.value * item.quantity);
      return acc;
    }, {});

    return Object.keys(CATEGORY_MAP).map(cat => ({
      name: cat,
      value: aggregates[cat] || 0,
      color: CATEGORY_MAP[cat].color
    })).sort((a, b) => b.value - a.value);
  }, [data]);

  const getSpecificIcon = (setName, broadCategory) => {
    const s = setName.toLowerCase();
    for (const [key, icon] of Object.entries(SPECIFIC_ICON_MAP)) {
      if (s.includes(key)) return icon;
    }
    return CATEGORY_MAP[broadCategory]?.icon || Package;
  };

  const CategoryIcon = ({ category, size = 16, className = "" }) => {
    const Icon = CATEGORY_MAP[category]?.icon || Package;
    return <Icon size={size} className={className} />;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl">
          <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1 italic">{data.name}</p>
          <p className="text-sm font-black italic tracking-tighter" style={{ color: data.color }}>
            ${Number(data.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-slate-100 flex flex-col font-sans pb-20 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-amber-950/10 blur-[150px] rounded-full pointer-events-none" />

      <header className="glass-header sticky top-0 z-40 px-4 md:px-6 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={() => navigate('/')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-amber-500 transition-all border border-white/5 shadow-xl">
            <ArrowLeft size={isMobile ? 18 : 20} />
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tighter text-white uppercase italic leading-none">The Vault</h1>
            <p className="text-[8px] md:text-[9px] text-gray-500 uppercase tracking-[0.4em] font-bold mt-1 mobile-hide">ASSET_LINK // SECURE_TRACKING</p>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold text-white focus:outline-none w-full md:w-64 shadow-inner transition-all focus:border-amber-500/50"
            />
          </div>
          <button onClick={fetchAndParseCSV} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-amber-500">
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-12 relative z-10 space-y-8 md:space-y-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] space-y-1 md:space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-amber-500"><DollarSign size={isMobile ? 60 : 80} /></div>
            <p className="text-[8px] md:text-[10px] font-black text-amber-500 uppercase tracking-widest">Market Value</p>
            <p className="text-3xl md:text-4xl font-black text-white tracking-tighter italic leading-none">
              ${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[8px] md:text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none">{activeCategory === 'All' ? 'Total Portfolio' : activeCategory}</p>
          </div>
          <div className="md:col-span-2 glass-card rounded-2xl md:rounded-[2rem] p-4 md:p-6 h-40 md:h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: isMobile ? 8 : 10, fontWeight: 'bold' }} 
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  content={<CustomTooltip />}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={isMobile ? 24 : 40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all border shrink-0 ${
                activeCategory === cat 
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                  : 'bg-white/5 text-gray-500 border-white/5 hover:text-white'
              }`}
            >
              {cat !== 'All' && <CategoryIcon category={cat} size={10} />}
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-elegant">
          {filteredAndSorted.map((item) => {
            const broadConfig = CATEGORY_MAP[item.broadCategory] || CATEGORY_MAP['Other'];
            const SpecificIcon = getSpecificIcon(item.specificSet, item.broadCategory);
            return (
              <div key={item.id} className="glass-card p-5 md:p-6 rounded-xl md:rounded-2xl group hover:bg-white/[0.05] transition-all relative">
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 transition-colors" style={{ color: broadConfig.color }}>
                    <SpecificIcon size={14} />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-mono font-black" style={{ color: broadConfig.color }}>
                    ${item.value.toFixed(2)}
                  </span>
                </div>
                <h3 className="text-[11px] md:text-xs font-black text-white uppercase italic tracking-tight line-clamp-2 mb-1 leading-tight">{item.name}</h3>
                <p className="text-[7px] md:text-[8px] font-black text-gray-600 uppercase tracking-widest">{item.specificSet}</p>
                <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-white/20 transition-all" />
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-500 group-hover:w-1/2" 
                  style={{ backgroundColor: broadConfig.color }} 
                />
              </div>
            );
          })}
        </div>
      </main>

      <footer className="mt-auto px-6 py-4 flex justify-between items-center bg-black/40 border-t border-white/5 text-gray-700">
        <span className="text-[8px] font-mono uppercase tracking-widest italic">SECURE_INDEX // {stats.count} Assets Tracked</span>
        <div className="flex gap-1">
          <div className={`w-1 h-1 bg-amber-500`} />
          <div className={`w-1 h-1 bg-amber-500 animate-pulse`} />
        </div>
      </footer>
    </div>
  );
}
