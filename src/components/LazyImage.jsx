import React, { useState } from 'react';
import { Image, AlertCircle } from 'lucide-react';

const LazyImage = ({ src, alt, className, placeholderColor = "bg-gray-800" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className} ${placeholderColor}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center animate-pulse p-2 text-center">
          <Image className="text-gray-700" size={24} />
          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mt-1 truncate">{alt}</span>
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/50 text-red-400 p-2 text-center">
          <AlertCircle size={24} className="mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Load Failed</span>
          <span className="text-[9px] text-red-500/80 truncate mt-0.5">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;
