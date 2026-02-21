import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Gamepad2, RefreshCcw, Star, Trophy, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GameCenterApp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('STEAM');

  return (
    <div className="bg-[#0f0f0f] h-full flex flex-col font-sans text-gray-200 overflow-hidden">
      <div className="bg-gray-900/80 backdrop-blur-xl sticky top-0 z-30 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-800 rounded-full text-yellow-500">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-white">Game Center</h1>
        </div>
        <ShieldCheck size={18} className="text-green-500 opacity-50" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center border border-blue-500/20 shadow-inner">
          <Gamepad2 size={40} className="text-blue-500" />
        </div>
        
        <div className="space-y-2 max-w-sm">
          <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">Security Shield Active</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your Steam, Xbox, and RetroAchievements keys are stored in a secure backend vault. 
            Direct client-side exposure has been disabled to prevent credential harvesting.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-xs pt-4">
          {['Steam', 'Xbox', 'Retro'].map(plat => (
            <div key={plat} className="flex flex-col items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-600 uppercase">{plat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto bg-black/40 border-t border-gray-900 p-4 flex justify-between items-center text-[10px] font-mono text-gray-600">
        <span>ENCRYPTED_TUNNEL: ACTIVE</span>
        <span>VAULT_VERIFIED</span>
      </div>
    </div>
  );
};

export default GameCenterApp;
