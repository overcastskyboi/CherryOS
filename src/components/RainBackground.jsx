import React, { useEffect, useRef } from 'react';
import { useOS } from '../context/OSContext';

const RainBackground = () => {
  const canvasRef = useRef(null);
  const { themeColor } = useOS();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const raindrops = [];
    const dropCount = 40; // Slightly more for better visibility across themes
    
    // Convert hex to rgb for opacity control
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 255, g: 255, b: 255 };
    };

    class Drop {
      constructor() {
        this.init();
      }

      init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.speed = 0.5 + Math.random() * 1.5; // Slightly faster for responsiveness
        this.length = 20 + Math.random() * 40;
        this.width = 0.5; // Hairline thin
        this.opacity = 0.05 + Math.random() * 0.15; // Increased visibility
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
          this.init();
        }
      }

      draw(rgb) {
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.opacity})`;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
      }
    }

    for (let i = 0; i < dropCount; i++) {
      raindrops.push(new Drop());
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const rgb = hexToRgb(themeColor);
      
      raindrops.forEach(drop => {
        drop.update();
        drop.draw(rgb);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-10]"
      style={{ background: 'transparent' }}
    />
  );
};

export default RainBackground;
