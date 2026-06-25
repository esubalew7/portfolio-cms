import React, { useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { CURSOR } from '../../utils/cursorConfig';

export const CursorGlow = React.memo(({ posRef }) => {
  const { isDarkMode } = useTheme();
  const elRef = useRef(null);
  const config = CURSOR.glow;
  const themeColors = isDarkMode ? config.dark : config.light;
  const rAF = useRef(null);

  React.useEffect(() => {
    const loop = () => {
      const el = elRef.current;
      if (!el) {
        rAF.current = requestAnimationFrame(loop);
        return;
      }
      const p = posRef.current;
      const size = config.size * (p.scale || 1);
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.transform = `translate(${p.x - size / 2}px, ${p.y - size / 2}px)`;
      rAF.current = requestAnimationFrame(loop);
    };
    rAF.current = requestAnimationFrame(loop);
    return () => {
      if (rAF.current) cancelAnimationFrame(rAF.current);
    };
  }, [posRef, config.size]);

  return (
    <div
      ref={elRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9995,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${themeColors.color} 0%, transparent 70%)`,
        filter: `blur(${themeColors.blur}px)`,
        willChange: 'transform, width, height',
      }}
    />
  );
});
