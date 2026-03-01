import React, { useEffect, useRef } from 'react';

const RainBackground = () => {
  const canvasRef = useRef(null);

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
    const dropCount = 40; // Even fewer for elegance
    const colors = ['#ffffff', '#60a5fa', '#3b82f6'];

    class Drop {
      constructor() {
        this.init();
      }

      init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.speed = 0.5 + Math.random() * 1.5; // Very slow, graceful
        this.length = 20 + Math.random() * 30; // Longer, thinner lines
        this.width = 0.5; // Ultra-thin
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = 0.03 + Math.random() * 0.07; // Very subtle
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
          this.init();
        }
      }

      draw() {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.globalAlpha = this.opacity;
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
