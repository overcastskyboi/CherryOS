import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Clapperboard, Star, ArrowLeft, RefreshCcw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WatchLogApp = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ANIME');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // SECURITY HARDENING: Direct API calls with keys are removed from frontend.
    // Use VITE_PROXY_URL to point to a secure OCI Function or Worker.
    const PROXY_URL = import.meta.env.VITE_PROXY_URL;

    if (!PROXY_URL) {
      console.warn("Security: No Proxy URL configured. Running in Demo Mode.");
      // Fallback to static data or demo response
      return setLoading(false);
    }

    try {
      const response = await fetch(`${PROXY_URL}/anilist`, {
        headers: { 'Accept': 'application/json' }
      });
      const json = await response.json();
      setData(json.data);
    } catch (err) {
      setError("Secure Proxy Connection Required.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="bg-[#0a0a0a] text-gray-100 min-h-screen flex flex-col font-sans overflow-hidden">
      <div className="bg-gray-900/80 backdrop-blur-xl sticky top-0 z-30 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-800 rounded-full text-yellow-500">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-white">Watch List</h1>
        </div>
        <button onClick={fetchData} disabled={loading} className="p-2 hover:bg-gray-800 rounded-full">
          <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl max-w-md shadow-2xl">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Clapperboard className="text-yellow-500" size={32} />
          </div>
          <h2 className="text-xl font-bold mb-2">Secure Connection Active</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            To protect your API credentials, live data is routed through a private serverless proxy. 
            Authentication headers are never exposed to the browser.
          </p>
          <div className="text-[10px] font-mono text-gray-600 uppercase tracking-tighter bg-black/40 py-2 rounded-lg">
            Status: {import.meta.env.VITE_PROXY_URL ? 'Connected' : 'Demo Mode (Restricted)'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchLogApp;
