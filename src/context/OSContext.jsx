import React, { createContext, useContext, useState, useEffect } from 'react';

const OSContext = createContext();

export const OSProvider = ({ children }) => {
  const [bootState, setBootState] = useState('booting'); // booting, locked, idle
  const [isMobile, setIsMobile] = useState(false);
  const [themeColor, setThemeColor] = useState('#3b82f6'); // Default Blue

  useEffect(() => {
    const checkMobile = () => {
      // Robust check including user agent sniffing for better device detection
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(window.innerWidth < 768 || isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <OSContext.Provider value={{ bootState, setBootState, isMobile, themeColor, setThemeColor }}>
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => useContext(OSContext);
