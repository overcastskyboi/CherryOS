import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      const { clientX, clientY } = e;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
      if (ringRef.current) {
        // Lag effect for the outer ring for a more organic feel
        ringRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = target.closest('button, a, input, select, [role="button"]');
      setIsHovering(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block overflow-hidden">
      {/* Outer Lagging Ring */}
      <div 
        ref={ringRef}
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-500/30 transition-all duration-500 ease-out will-change-transform ${
          isHovering ? 'w-12 h-12 border-cyan-400/50 rotate-45 scale-125' : 'w-8 h-8'
        }`}
      />
      
      {/* Main Precise Cursor */}
      <div 
        ref={cursorRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center will-change-transform"
      >
        {/* Inner Dot */}
        <div 
          className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
            isHovering ? 'bg-cyan-400 scale-150 shadow-[0_0_15px_#22d3ee]' : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'
          } ${isClicking ? 'scale-75' : 'scale-100'}`} 
        />

        {/* Tactical Crosshair (Visible on hover) */}
        <div className={`absolute transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute -translate-x-1/2 -translate-y-[24px] w-[1px] h-3 bg-cyan-400/60" />
          <div className="absolute -translate-x-1/2 translate-y-[12px] w-[1px] h-3 bg-cyan-400/60" />
          <div className="absolute -translate-x-[24px] -translate-y-1/2 w-3 h-[1px] bg-cyan-400/60" />
          <div className="absolute translate-x-[12px] -translate-y-1/2 w-3 h-[1px] bg-cyan-400/60" />
        </div>
        
        {/* Scanning Line (Visible on hover) */}
        <div 
          className={`absolute w-16 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transition-opacity duration-500 ${
            isHovering ? 'opacity-100 animate-pulse' : 'opacity-0'
          }`}
          style={{ transform: 'rotate(-45deg)' }}
        />
      </div>
    </div>
  );
};

export default CustomCursor;
