import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, X, Info, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VST_DETAILS } from '../data/constants';
import LazyImage from '../components/LazyImage';
import { useOS } from '../context/OSContext';

const StudioRackApp = () => {
  const navigate = useNavigate();
  const { setThemeColor, isMobile } = useOS();

  useEffect(() => {
    setThemeColor('#f59e0b'); // Cherry Amber
  }, [setThemeColor]);
  const [selectedSuite, setSelectedSuite] = useState(null);
  const [activePluginIndex, setActivePluginIndex] = useState(0);

  const Modal = ({ suite, onClose }) => {
    const plugin = suite.plugins[activePluginIndex];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
        
        <div className="relative w-full max-w-5xl bg-[#111] border-4 border-white shadow-[8px_8px_0_#000] flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto md:overflow-hidden">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black text-white hover:bg-white hover:text-black transition-colors"
          >
            <X size={20} />
          </button>

          {/* Plugin Interface View */}
          <div className="flex-1 bg-black p-4 flex flex-col items-center justify-center gap-4 min-h-[250px] md:min-h-[300px]">
            <div className="relative w-full h-full max-h-[300px] md:max-h-[400px] border-2 border-[#333] overflow-hidden group">
              <LazyImage 
                src={plugin.interface} 
                alt={plugin.name} 
                className="w-full h-full object-contain image-rendering-auto"
              />
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <div className="text-center px-4">
              <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">{plugin.name}</h4>
              <p className="text-[10px] text-gray-500 uppercase mt-1">{plugin.desc}</p>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="w-full md:w-80 bg-[#1a1a1a] border-t-4 md:border-t-0 md:border-l-4 border-[#333] p-6 flex flex-col shrink-0">
            <span className="text-[8px] md:text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2">{suite.category}</span>
            <h2 className="text-lg md:text-xl font-black text-white uppercase italic leading-tight mb-4">{suite.name}</h2>
            <p className="text-[10px] text-gray-400 leading-relaxed mb-6 md:mb-8 md:flex-1">{suite.blurb}</p>

            {/* Selector */}
            <div className="space-y-2 mb-6 md:mb-8">
              <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Select Module:</p>
              <div className="flex flex-col gap-1">
                {suite.plugins.map((p, idx) => (
                  <button
                    key={p.name}
                    onClick={() => setActivePluginIndex(idx)}
                    className={`flex items-center justify-between px-3 py-2 text-[10px] font-bold uppercase transition-all ${
                      activePluginIndex === idx 
                        ? 'bg-blue-600 text-white translate-x-1' 
                        : 'bg-black/40 text-gray-500 hover:text-white'
                    }`}
                  >
                    {p.name}
                    {activePluginIndex === idx && <ChevronRight size={12} />}
                  </button>
                ))}
              </div>
            </div>

            <a 
              href={suite.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 hover:text-white transition-all shadow-[4px_4px_0_#000] mb-4 md:mb-0"
            >
              Learn More <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0a0a0a] min-h-[100dvh] flex flex-col text-gray-300 font-sans pb-20">
      {/* Header */}
      <div className="bg-black border-b-4 border-[#111] px-4 md:px-6 py-4 md:py-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => navigate('/')}
            className="p-2 bg-[#111] border-2 border-[#333] text-blue-500 hover:border-white transition-all shadow-[2px_2px_0_#000]"
          >
            <ArrowLeft size={isMobile ? 20 : 24} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic leading-none">Studio Rack</h1>
            <p className="text-[8px] md:text-[10px] text-gray-600 uppercase tracking-[0.4em] font-bold mt-1 mobile-hide">VST_LIBRARY</p>
          </div>
        </div>
      </div>

      <main className="flex-1 p-4 md:p-12 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
          {VST_DETAILS.map((suite) => (
            <button 
              key={suite.id}
              onClick={() => {
                setSelectedSuite(suite);
                setActivePluginIndex(0);
              }}
              className="group relative flex flex-col text-left transition-all active:scale-95"
            >
              {/* Pixel Art Card */}
              <div className="aspect-video relative border-4 border-[#111] bg-[#111] overflow-hidden group-hover:border-blue-600 transition-all shadow-[8px_8px_0_#000] mb-3 md:mb-4">
                <LazyImage 
                  src={suite.image} 
                  alt={suite.name} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">
                  <span className="px-2 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest">
                    {suite.category}
                  </span>
                </div>
              </div>
              
              <h3 className="text-base md:text-lg font-black text-white uppercase italic tracking-tight group-hover:text-blue-400 transition-colors leading-tight">
                {suite.name}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 md:mt-2">
                <div className="h-[2px] w-6 md:w-8 bg-blue-600" />
                <span className="text-[8px] md:text-[9px] font-bold text-gray-600 uppercase tracking-widest">Open Suite</span>
              </div>
            </button>
          ))}
        </div>
      </main>

      {selectedSuite && (
        <Modal suite={selectedSuite} onClose={() => setSelectedSuite(null)} />
      )}

      {/* Background Decor */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.02] pointer-events-none select-none z-0">
        STUDIO
      </div>
    </div>
  );
};

export default StudioRackApp;
