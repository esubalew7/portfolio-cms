import React, { useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { CURSOR } from '../../utils/cursorConfig';

export const CursorCore = React.memo(({ posRef, state }) => {
  const { isDarkMode } = useTheme();
  const elRef = useRef(null);
  const config = CURSOR.core;
  const themeColors = isDarkMode ? config.dark : config.light;

  const sizeMap = {
    default: config.restSize,
    click: config.activeSize,
    open: config.activeSize,
    visit: config.hoverSize,
    code: config.activeSize,
    rotate: config.hoverSize,
    view: config.hoverSize,
    explore: config.hoverSize,
    save: config.activeSize,
    delete: config.activeSize,
    upload: config.activeSize,
  };

  const currentSize = sizeMap[state] || config.restSize;

  const rAF = useRef(null);

  React.useEffect(() => {
    const loop = () => {
      const el = elRef.current;
      if (!el) {
        rAF.current = requestAnimationFrame(loop);
        return;
      }
      const p = posRef.current;
      const scale = p.scale || 1;
      const size = currentSize * scale;
      el.style.width = `${size}px`;
      el.style.height = `${size * p.compressY}px`;
      el.style.transform = `translate(${p.x - size / 2}px, ${p.y - (size * p.compressY) / 2}px)`;
      rAF.current = requestAnimationFrame(loop);
    };
    rAF.current = requestAnimationFrame(loop);
    return () => {
      if (rAF.current) cancelAnimationFrame(rAF.current);
    };
  }, [posRef, currentSize]);

  return (
    <div
      ref={elRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9998,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${themeColors.color}, rgba(255,255,255,0.3))`,
        boxShadow: `0 0 ${themeColors.glowSpread}px ${themeColors.glow}`,
        willChange: 'transform, width, height',
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
      }}
    />
  );
});
