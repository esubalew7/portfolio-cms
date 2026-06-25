import React, { useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { CURSOR } from '../../utils/cursorConfig';

export const CursorRing = React.memo(({ posRef, state }) => {
  const { isDarkMode } = useTheme();
  const elRef = useRef(null);
  const config = CURSOR.ring;
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
      const rotationSpeed = config.rotationSpeed || 0.3;
      p.ringRotation = (p.ringRotation || 0) + rotationSpeed;
      const scale = p.scale || 1;
      const size = currentSize * scale;

      el.style.width = `${size}px`;
      el.style.height = `${size * p.compressY}px`;
      el.style.transform = `translate(${p.x - size / 2}px, ${p.y - (size * p.compressY) / 2}px) rotate(${p.ringRotation}deg)`;
      rAF.current = requestAnimationFrame(loop);
    };
    rAF.current = requestAnimationFrame(loop);
    return () => {
      if (rAF.current) cancelAnimationFrame(rAF.current);
    };
  }, [posRef, currentSize, config.rotationSpeed]);

  return (
    <div
      ref={elRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9997,
        borderRadius: '50%',
        border: `${config.borderWidth}px solid ${themeColors.color}`,
        boxShadow: `0 0 12px ${themeColors.glow}, inset 0 0 12px ${themeColors.glow}`,
        willChange: 'transform, width, height',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    />
  );
});
