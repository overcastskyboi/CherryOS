import React, { useEffect, useRef } from 'react';

const RainBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.ref || canvasRef.current;
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
    const dropCount = 150;
    const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#1e40af'];

    class Drop {
      constructor() {
        this.init();
      }

      init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.speed = 4 + Math.random() * 6;
        this.length = 10 + Math.random() * 15;
        this.width = 2 + Math.random() * 2; // Pixel art "thick" drops
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = 0.1 + Math.random() * 0.3;
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
          this.init();
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        // Draw pixelated drop (rectangle)
        ctx.fillRect(this.x, this.y, this.width, this.length);
      }
    }

    for (let i = 0; i < dropCount; i++) {
      raindrops.push(new Drop());
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      raindrops.forEach(drop => {
        drop.update();
        drop.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{ background: 'transparent' }}
    />
  );
};

export default RainBackground;
