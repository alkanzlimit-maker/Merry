
import React, { useEffect, useRef } from 'react';
import { Snowflake } from '../types';

const SnowLayer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakes = useRef<Snowflake[]>([]);
  const lastInteraction = useRef<{ x: number; y: number; active: boolean; time: number }>({
    x: 0,
    y: 0,
    active: false,
    time: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initSnow();
    };

    const initSnow = () => {
      const count = Math.floor((window.innerWidth * window.innerHeight) / 8000);
      snowflakes.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 1 + 0.5,
        wind: (Math.random() - 0.5) * 0.5
      }));
    };

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();

      const currentTime = Date.now();
      const interactionActive = lastInteraction.current.active && (currentTime - lastInteraction.current.time < 300);

      snowflakes.current.forEach((flake) => {
        // Base movement
        flake.y += flake.speed + flake.vy;
        flake.x += flake.wind + flake.vx;

        // Apply friction to interaction velocity
        flake.vx *= 0.95;
        flake.vy *= 0.95;

        // Interaction "Push" effect
        if (interactionActive) {
          const dx = flake.x - lastInteraction.current.x;
          const dy = flake.y - lastInteraction.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const threshold = 150;

          if (distance < threshold) {
            const force = (threshold - distance) / threshold;
            const angle = Math.atan2(dy, dx);
            // Push intensity
            const pushX = Math.cos(angle) * force * 10;
            const pushY = Math.sin(angle) * force * 10;
            
            flake.vx += pushX;
            flake.vy += pushY;
          }
        }

        ctx.moveTo(flake.x, flake.y);
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);

        // Screen wrap/reset
        if (flake.y > canvas.height) {
          flake.y = -flake.radius;
          flake.x = Math.random() * canvas.width;
          flake.vx = 0;
          flake.vy = 0;
        }
        if (flake.x > canvas.width) flake.x = 0;
        if (flake.x < 0) flake.x = canvas.width;
      });

      ctx.fill();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleInteraction = (e: MouseEvent | TouchEvent) => {
      let x, y;
      if ('touches' in e) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else {
        x = (e as MouseEvent).clientX;
        y = (e as MouseEvent).clientY;
      }
      
      lastInteraction.current = {
        x,
        y,
        active: true,
        time: Date.now()
      };
    };

    window.addEventListener('resize', updateSize);
    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    
    updateSize();
    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
};

export default SnowLayer;
