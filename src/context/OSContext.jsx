import React, { createContext, useContext, useState } from 'react';

const OSContext = createContext();

export const OSProvider = ({ children }) => {
  const [bootState, setBootState] = useState('booting'); // booting, locked, idle

  return (
    <OSContext.Provider value={{ bootState, setBootState }}>
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => useContext(OSContext);
