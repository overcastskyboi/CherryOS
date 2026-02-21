import { useState, useEffect } from 'react';
import { useOS } from '../context/OSContext';

const BootScreen = () => {
  const { setBootState } = useOS();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        // eslint-disable-next-line sonarjs/pseudo-random
        return Math.min(100, p + Math.floor(Math.random() * 10));
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setBootState('locked'), 500);
    }
  }, [progress, setBootState]);

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center font-mono">
      <div className="w-64 space-y-2">
        <div className="flex justify-between text-xs text-green-500">
          <span>BOOT_LOADER</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 transition-all duration-75" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default BootScreen;
