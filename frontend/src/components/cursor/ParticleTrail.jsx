import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { CURSOR } from '../../utils/cursorConfig';

export const ParticleTrail = React.memo(({ posRef }) => {
  const canvasRef = useRef(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let raf;
    const pool = [];
    const MAX = CURSOR.trail.maxParticles;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const spawnParticle = (x, y) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.1 + Math.random() * 0.3;
      const p = {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: CURSOR.trail.baseSize * (0.5 + Math.random() * 0.8),
        alpha: 0.8 + Math.random() * 0.2,
      };
      pool.push(p);
      if (pool.length > MAX) pool.shift();
    };

    let spawnCounter = 0;

    const tick = () => {
      const p = posRef.current;
      const vel = Math.sqrt(
        (p.x - (p.prevX || p.x)) ** 2 + (p.y - (p.prevY || p.y)) ** 2
      );

      const spawnCount =
        vel > CURSOR.trail.fastThreshold
          ? CURSOR.trail.fastSpawnRate
          : vel > CURSOR.trail.minSpeed
            ? CURSOR.trail.spawnRate
            : 0;

      spawnCounter += spawnCount;
      while (spawnCounter >= 1) {
        spawnParticle(p.x, p.y);
        spawnCounter -= 1;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const primaryColor = isDarkMode ? '59,130,246' : '37,99,235';
      const accentColor = isDarkMode ? '139,92,246' : '147,197,253';

      for (let i = pool.length - 1; i >= 0; i--) {
        const pt = pool[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vx *= 0.94;
        pt.vy *= 0.94;
        pt.alpha *= CURSOR.trail.fadeFactor;
        pt.size *= CURSOR.trail.shrinkFactor;

        if (pt.alpha < 0.01 || pt.size < 0.1) {
          pool.splice(i, 1);
          continue;
        }

        const gradient = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.size * 2);
        gradient.addColorStop(0, `rgba(${primaryColor},${pt.alpha})`);
        gradient.addColorStop(0.3, `rgba(${primaryColor},${pt.alpha * 0.5})`);
        gradient.addColorStop(0.6, `rgba(${accentColor},${pt.alpha * 0.2})`);
        gradient.addColorStop(1, `rgba(${accentColor},0)`);

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      p.prevX = p.x;
      p.prevY = p.y;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [posRef, isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9996,
      }}
    />
  );
});
