import React, { useState } from 'react';
import { Image, AlertCircle } from 'lucide-react';

const LazyImage = ({ src, alt, className, placeholderColor = "bg-gray-800" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className} ${placeholderColor}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <Image className="text-gray-700" size={24} />
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-gray-600 p-2">
          <AlertCircle size={24} className="mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Failed</span>
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
