import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Papa from 'papaparse';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, Package, ArrowLeft, RefreshCcw, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CollectionTrackerApp() {
  const navigate = useNavigate();
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
          const processed = results.data.map(row => ({
            id: row.id,
            name: row['product-name'],
            category: row['console-name'] || 'Uncategorized',
            value: (row['price-in-pennies'] || 0) / 100,
            quantity: row.quantity || 1,
            date: row['date-entered']
          }));
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

  const categories = useMemo(() => {
    const cats = new Set(data.map(i => i.category));
    return ['All', ...Array.from(cats).sort()];
  }, [data]);

  const filteredAndSorted = useMemo(() => {
    return data
      .filter(item => {
        const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = activeCategory === 'All' || item.category === activeCategory;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => b.value - a.value); // Strict Value Sort: High to Low
  }, [data, searchQuery, activeCategory]);

  const stats = useMemo(() => {
    const total = filteredAndSorted.reduce((acc, curr) => acc + (curr.value * curr.quantity), 0);
    const count = filteredAndSorted.length;
    return { total, count };
  }, [filteredAndSorted]);

  // Generate chart data based on filtered results
  const chartData = useMemo(() => {
    return filteredAndSorted
      .slice(0, 20)
      .reverse()
      .map(item => ({ name: item.name?.substring(0, 10), value: item.value }));
  }, [filteredAndSorted]);

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-slate-100 flex flex-col font-sans pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-amber-950/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="glass-header sticky top-0 z-40 px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-amber-500 transition-all border border-white/5 shadow-xl">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">The Vault</h1>
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.4em] font-bold mt-1">ASSET_LINK // SECURE_TRACKING</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold text-white focus:outline-none w-64"
            />
          </div>
          <button onClick={fetchAndParseCSV} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all">
            <RefreshCcw size={16} className={loading ? 'animate-spin' : 'text-amber-500'} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 relative z-10 space-y-12 max-w-7xl mx-auto w-full">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-8 rounded-[2rem] space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-amber-500"><DollarSign size={80} /></div>
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Market Value</p>
            <p className="text-4xl font-black text-white tracking-tighter italic">
              ${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="md:col-span-2 glass-card rounded-[2rem] p-6 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#f59e0b" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
                activeCategory === cat ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-white/5 text-gray-500 border-white/5 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-elegant">
          {filteredAndSorted.map((item) => (
            <div key={item.id} className="glass-card p-6 rounded-2xl group hover:bg-white/[0.05] transition-all relative">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-black/40 text-amber-500 border border-white/5">
                  <Package size={16} />
                </div>
                <span className="text-[10px] font-mono font-black text-amber-500">${item.value.toFixed(2)}</span>
              </div>
              <h3 className="text-xs font-black text-white uppercase italic tracking-tight line-clamp-2 mb-1">{item.name}</h3>
              <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{item.category}</p>
              
              <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent group-hover:via-amber-500/50 transition-all" />
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-auto px-6 py-4 flex justify-between items-center bg-black/40 border-t border-white/5 text-gray-700">
        <span className="text-[8px] font-mono uppercase tracking-widest italic">SECURE_INDEX // {stats.count} Assets Tracked</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-amber-500" />
          <div className="w-1 h-1 bg-amber-500 animate-pulse" />
        </div>
      </footer>
    </div>
  );
}
