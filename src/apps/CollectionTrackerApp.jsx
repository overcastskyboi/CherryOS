import React, { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Dexie from 'dexie';
import { TrendingUp, DollarSign, Package, ArrowLeft, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Initialize Local Database
const db = new Dexie('CherryOS_CollectionDB');
db.version(1).stores({
  history: '++id, date, totalValue',
});

export default function CollectionTrackerApp() {
  const navigate = useNavigate();
  const [currentTotal, setCurrentTotal] = useState(0);
  const [mostValuable, setMostValuable] = useState({});
  const [historyData, setHistoryData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  const loadHistory = useCallback(async (total) => {
    const records = await db.history.orderBy('date').toArray();
    
    // If no records or latest record is from a different day, add new record
    const today = new Date().toLocaleDateString();
    const hasToday = records.some(r => new Date(r.date).toLocaleDateString() === today);
    
    if (!hasToday && total > 0) {
      await db.history.add({
        date: new Date().toISOString(),
        totalValue: total
      });
      // Re-fetch
      const updatedRecords = await db.history.orderBy('date').toArray();
      setHistoryData(updatedRecords.map(r => ({
        date: new Date(r.date).toLocaleDateString(),
        value: r.totalValue
      })));
    } else {
      setHistoryData(records.map(r => ({
        date: new Date(r.date).toLocaleDateString(),
        value: r.totalValue
      })));
    }
  }, []);

  const fetchAndParseCSV = useCallback(async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/collection.csv');
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const rows = results.data;
          let total = 0;
          const categoryLeaders = {};

          rows.forEach(row => {
            const priceInPennies = parseInt(row['price-in-pennies']) || 0;
            const quantity = parseInt(row['quantity']) || 0;
            const itemValue = (priceInPennies * quantity) / 100;
            const singleValue = priceInPennies / 100;
            
            total += itemValue;

            const category = typeof row['console-name'] === 'string' ? row['console-name'] : 'Uncategorized';
            const itemName = typeof row['product-name'] === 'string' ? row['product-name'] : 'Unknown Item';
            
            if (!categoryLeaders[category] || singleValue > categoryLeaders[category].value) {
              categoryLeaders[category] = {
                name: itemName,
                value: singleValue
              };
            }
          });

          setCurrentTotal(total);
          setMostValuable(categoryLeaders);
          setLastUpdated(new Date().toLocaleDateString());
          await loadHistory(total);
          setIsProcessing(false);
        }
      });
    } catch (error) {
      console.error("Failed to load collection data:", error);
      setIsProcessing(false);
    }
  }, [loadHistory]);

  useEffect(() => {
    fetchAndParseCSV();
  }, [fetchAndParseCSV]);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#0f172a]/95 text-slate-100 pb-20 font-sans">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-full text-amber-500 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic flex items-center gap-2">
              <Package className="w-6 h-6 text-amber-500" />
              Vault Tracker
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold">
              {isProcessing ? 'Syncing Data...' : `Last Synced: ${lastUpdated}`}
            </p>
          </div>
        </div>
        <button 
          onClick={fetchAndParseCSV}
          className="p-2 hover:bg-white/5 rounded-full text-amber-500 transition-all active:rotate-180 duration-500"
          title="Refresh Data"
        >
          <RefreshCcw size={20} className={isProcessing ? 'animate-spin' : ''} />
        </button>
      </div>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Value Card */}
          <div className="bg-gray-900/60 border border-white/5 p-8 rounded-3xl relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500 group-hover:opacity-20 transition-opacity">
              <DollarSign size={80} />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] text-amber-500/80 font-black uppercase tracking-[0.2em] mb-2">Total Market Value</p>
              <p className="text-4xl font-black text-white tracking-tighter leading-none">
                ${currentTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-500">
                <TrendingUp size={12} />
                <span>Live Portfolio Status</span>
              </div>
            </div>
          </div>

          {/* Chart Card */}
          <div className="md:col-span-2 bg-gray-900/60 border border-white/5 p-8 rounded-3xl shadow-2xl h-64 md:h-auto min-h-[250px]">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Market Projection
            </p>
            {historyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#f59e0b' }}
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Value']}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#f59e0b"
                    strokeWidth={4}
                    dot={{ fill: '#f59e0b', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, stroke: '#ffffff30', strokeWidth: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-600 text-xs font-bold uppercase tracking-widest italic">
                Data aggregation in progress...
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-l-2 border-amber-500 pl-4">
            <h2 className="text-lg font-black text-white uppercase tracking-widest leading-none">Category Leaders</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(mostValuable)
              .sort(([, a], [, b]) => b.value - a.value)
              .map(([category, item]) => (
                <div key={category} className="bg-gray-900/40 border border-white/5 p-6 rounded-2xl hover:border-amber-500/20 transition-all group">
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mb-2 truncate group-hover:text-amber-500/50 transition-colors">
                    {category}
                  </p>
                  <p className="text-sm text-gray-200 font-bold mb-3 line-clamp-1 uppercase tracking-tight group-hover:text-white transition-colors">
                    {item.name}
                  </p>
                  <p className="text-xl font-black text-amber-500 font-mono tracking-tighter">
                    ${item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
