import { User } from 'lucide-react';
import { useOS } from '../context/OSContext';
import { useEffect } from 'react';

const LockScreen = () => {
  const { setBootState } = useOS();
  
  useEffect(() => {
    console.log('LockScreen mounted');
    return () => console.log('LockScreen unmounted');
  }, []);

  return (
    <div onClick={() => {
      console.log('LockScreen clicked, requesting desktop...');
      setBootState('desktop');
    }} className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden cursor-pointer group">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614726365723-49cfae96c698?q=80&w=2600&auto=format&fit=crop')] bg-cover opacity-30 grayscale group-hover:grayscale-0 transition-all duration-1000" />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm group-hover:backdrop-blur-none transition-all duration-700" />
      <img src="assets/images/cloud_mascot.png" alt="Cloud Mascot" className="w-24 h-24 mb-4 z-10" />
      <div className="z-10 text-center space-y-4">
        <div className="w-32 h-32 rounded-full border-2 border-yellow-500/50 flex items-center justify-center mx-auto mb-6"><User size={48} className="text-yellow-500" /></div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">CHERRY OS</h1>
        <p className="text-gray-400 font-mono text-sm tracking-[0.3em] animate-pulse">TOUCH TO INITIALIZE</p>
      </div>
    </div>
  );
};

export default LockScreen;
