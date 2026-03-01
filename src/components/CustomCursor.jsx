import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('button, a, input, select')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
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
    <div 
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {/* Outer Ring */}
      <div 
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-500/50 transition-all duration-300 ease-out ${
          isHovering ? 'w-10 h-10 border-cyan-400 rotate-45' : 'w-6 h-6'
        } ${isClicking ? 'scale-75 opacity-100' : 'scale-100 opacity-40'}`}
      />
      
      {/* Inner Dot */}
      <div 
        className={`absolute -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-200 ${
          isHovering ? 'bg-cyan-400 scale-150 shadow-[0_0_10px_#22d3ee]' : 'bg-rose-500'
        }`} 
      />

      {/* Crosshair accents when hovering */}
      {isHovering && (
        <>
          <div className="absolute -translate-x-1/2 -translate-y-[20px] w-[1px] h-2 bg-cyan-400/40" />
          <div className="absolute -translate-x-1/2 translate-y-[12px] w-[1px] h-2 bg-cyan-400/40" />
          <div className="absolute -translate-x-[20px] -translate-y-1/2 w-2 h-[1px] bg-cyan-400/40" />
          <div className="absolute translate-x-[12px] -translate-y-1/2 w-2 h-[1px] bg-cyan-400/40" />
        </>
      )}
    </div>
  );
};

export default CustomCursor;
