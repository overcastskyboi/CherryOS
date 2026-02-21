import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Dexie from 'dexie';
import { Upload, TrendingUp, DollarSign, Package } from 'lucide-react';

// Initialize Local Database
const db = new Dexie('CherryOS_CollectionDB');
db.version(1).stores({
  history: '++id, date, totalValue',
});

export default function CollectionTrackerApp() {
  const [currentTotal, setCurrentTotal] = useState(0);
  const [mostValuable, setMostValuable] = useState({});
  const [historyData, setHistoryData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadHistory = async () => {
    const records = await db.history.orderBy('date').toArray();
    if (records.length > 0) {
      const latest = records[records.length - 1];
      setCurrentTotal(latest.totalValue);
      setLastUpdated(new Date(latest.date).toLocaleDateString());
      
      const formattedHistory = records.map(r => ({
        date: new Date(r.date).toLocaleDateString(),
        value: r.totalValue
      }));
      setHistoryData(formattedHistory);
    }
  };

  useEffect(() => {
    (async () => {
      await loadHistory();
    })();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        let total = 0;
        const categoryLeaders = {};

        rows.forEach(row => {
          // Parse values, defaulting to 0 if missing
          const priceInPennies = parseInt(row['price-in-pennies']) || 0;
          const quantity = parseInt(row['quantity']) || 0;
          const itemValue = (priceInPennies * quantity) / 100;
          const singleValue = priceInPennies / 100;
          
          total += itemValue;

          // Group by broad category or console-name
          const category = row['console-name'] || 'Uncategorized';
          const itemName = row['product-name'] || 'Unknown Item';

          if (!categoryLeaders[category] || singleValue > categoryLeaders[category].value) {
            categoryLeaders[category] = {
              name: itemName,
              value: singleValue
            };
          }
        });

        setCurrentTotal(total);
        setMostValuable(categoryLeaders);
        
        // Log to local database
        const today = new Date().toISOString();
        await db.history.add({
          date: today,
          totalValue: total
        });

        await loadHistory();
        setIsProcessing(false);
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-goldenrod" />
            Collection Dashboard
          </h1>
          {lastUpdated && <p className="text-sm text-slate-400 mt-1">Last updated: {lastUpdated}</p>}
        </div>
        
        <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded cursor-pointer transition-colors">
          <Upload className="w-4 h-4" />
          <span className="text-sm font-medium">{isProcessing ? 'Processing...' : 'Upload PriceCharting CSV'}</span>
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            onChange={handleFileUpload} 
            disabled={isProcessing}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-900/30 rounded text-green-400">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium mb-1">Total Collection Value</p>
            <p className="text-3xl font-bold text-white">
              ${currentTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="md:col-span-2 bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-sm h-48">
          <p className="text-sm text-slate-400 font-medium mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Value Over Time
          </p>
          {historyData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '4px' }}
                  itemStyle={{ color: '#fed690' }}
                  formatter={(value) => [`$${value.toFixed(2)}`, 'Value']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#fed690"
                  strokeWidth={3}
                  dot={{ fill: '#fed690', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500 text-sm">
              <img src="/assets/images/cloud_mascot.png" alt="Cloud Mascot" className="w-16 h-16 mr-4" />
              Upload multiple times on different days to see chart progression.
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">Most Valuable by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(mostValuable)
            .sort(([, a], [, b]) => b.value - a.value)
            .map(([category, item]) => (
              <div key={category} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1 truncate" title={category}>
                  {category}
                </p>
                <p className="text-sm text-white font-medium mb-2 line-clamp-2" title={item.name}>
                  {item.name}
                </p>
                <p className="text-lg text-goldenrod font-bold">
                  ${item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
}
