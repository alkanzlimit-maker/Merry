import React, { useEffect, useRef, useCallback } from 'react';
import { Particle, Rocket, Point } from '../types';

const COLORS = ['#FF3F3F', '#FFD700', '#2E933C', '#FFFFFF', '#00BFFF', '#FF69B4'];

// Using only the specific sound URL requested
const FIREWORK_SOUND_URL = "https://gfxsounds.com/wp-content/uploads/2024/01/Fireworks-two-stage-launch-whistle-and-explosion-2.mp3";

const FireworksLayer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rockets = useRef<Rocket[]>([]);
  const particles = useRef<Particle[]>([]);
  
  // Audio object preloaded
  const soundTemplate = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(FIREWORK_SOUND_URL);
    audio.preload = "auto";
    soundTemplate.current = audio;
  }, []);

  const playSFX = (volume = 0.5) => {
    if (!soundTemplate.current) return;
    try {
      const audioClone = soundTemplate.current.cloneNode(true) as HTMLAudioElement;
      audioClone.volume = volume;
      audioClone.play().catch(() => {
        // Handle autoplay restrictions gracefully
      });
      
      audioClone.onended = () => {
        audioClone.remove();
      };
    } catch (e) {
      console.error("Audio playback error:", e);
    }
  };

  const createFirework = useCallback((targetX: number, targetY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const startX = canvas.width / 2;
    const startY = canvas.height;
    const angle = Math.atan2(targetY - startY, targetX - startX);
    const speed = 10 + Math.random() * 6;
    
    // Play the combined whistle + explosion sound
    playSFX(0.6);

    rockets.current.push({
      x: startX,
      y: startY,
      targetX,
      targetY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      trail: [],
      distanceToTarget: Math.sqrt(Math.pow(targetX - startX, 2) + Math.pow(targetY - startY, 2)),
      exploded: false
    });
  }, []);

  const explode = (x: number, y: number, color: string) => {
    const count = 130 + Math.floor(Math.random() * 70);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particles.current.push({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        alpha: 1, color, decay: Math.random() * 0.01 + 0.01,
        gravity: 0.1, friction: 0.96
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    let animationFrameId: number;
    const animate = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      rockets.current = rockets.current.filter((r) => {
        r.x += r.vx; r.y += r.vy;
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 12) r.trail.shift();
        
        if (Math.random() > 0.4) {
          particles.current.push({
            x: r.x, y: r.y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            alpha: 0.8, color: '#FFD700', decay: 0.05,
            gravity: 0.05, friction: 0.98
          });
        }

        const dist = Math.sqrt(Math.pow(r.targetX - r.x, 2) + Math.pow(r.targetY - r.y, 2));
        if (dist < 35 || r.vy >= 0) {
          explode(r.x, r.y, r.color);
          return false;
        }
        
        ctx.beginPath();
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2.5;
        if (r.trail.length > 1) {
            ctx.moveTo(r.trail[0].x, r.trail[0].y);
            for (let i = 1; i < r.trail.length; i++) ctx.lineTo(r.trail[i].x, r.trail[i].y);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        return true;
      });

      particles.current = particles.current.filter((p) => {
        p.vx *= p.friction; p.vy *= p.friction; p.vy += p.gravity;
        p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
        if (p.alpha <= 0) return false;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleInteraction = (e: MouseEvent | TouchEvent) => {
      let x, y;
      if ('touches' in e && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else {
        const mouseEvent = e as MouseEvent;
        x = mouseEvent.clientX;
        y = mouseEvent.clientY;
      }
      createFirework(x, y);
    };

    window.addEventListener('resize', updateSize);
    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    updateSize();
    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      cancelAnimationFrame(animationFrameId);
    };
  }, [createFirework]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-20 cursor-crosshair" />;
};

export default FireworksLayer;