import React, { useState, useEffect } from 'react';
import { Image, AlertCircle } from 'lucide-react';

const LazyImage = ({ src, alt, className, placeholderColor = "bg-gray-800" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className} ${placeholderColor}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center animate-pulse p-2 text-center">
          <Image className="text-gray-700" size={24} />
          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mt-1 truncate max-w-full px-2">{alt}</span>
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/20 text-red-400 p-2 text-center border border-red-500/10">
          <AlertCircle size={24} className="mb-1 opacity-50" />
          <span className="text-[8px] uppercase font-black tracking-widest opacity-50">Link Error</span>
          <span className="text-[7px] text-red-500/40 truncate mt-0.5 max-w-full px-2">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            console.warn(`LazyImage failed to load: ${src}`);
            setHasError(true);
          }}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;
