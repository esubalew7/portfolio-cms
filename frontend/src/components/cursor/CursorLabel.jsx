import React, { useRef } from 'react';
import { CURSOR } from '../../utils/cursorConfig';

export const CursorLabel = React.memo(({ posRef, label }) => {
  const elRef = useRef(null);
  const rAF = useRef(null);
  const config = CURSOR.label;

  React.useEffect(() => {
    const loop = () => {
      const el = elRef.current;
      if (!el || !label) {
        rAF.current = requestAnimationFrame(loop);
        return;
      }
      const p = posRef.current;
      const offsetX = config.offsetX;
      const offsetY = config.offsetY;
      el.style.transform = `translate(${p.x + offsetX}px, ${p.y + offsetY}px)`;
      rAF.current = requestAnimationFrame(loop);
    };

    if (label) {
      rAF.current = requestAnimationFrame(loop);
    }

    return () => {
      if (rAF.current) cancelAnimationFrame(rAF.current);
    };
  }, [posRef, label, config]);

  if (!label) return null;

  return (
    <div
      ref={elRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        fontSize: `${config.fontSize}px`,
        letterSpacing: `${config.letterSpacing}px`,
        fontWeight: 700,
        color: '#3b82f6',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        willChange: 'transform',
        textShadow: '0 0 8px rgba(59,130,246,0.3), 0 0 20px rgba(59,130,246,0.1)',
        opacity: label ? 1 : 0,
        transition: 'opacity 0.15s ease',
      }}
    >
      {label}
    </div>
  );
});
