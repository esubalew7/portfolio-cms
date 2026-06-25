import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const PRIMARY = '#2563eb';

export const TimelineNode = React.memo(({ item, isActive, isVisible, index }) => {
  const { isDarkMode } = useTheme();
  const [floatY, setFloatY] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    let frame;
    const start = Date.now();
    const animate = () => {
      if (!mountedRef.current) return;
      const elapsed = (Date.now() - start) / 1000;
      setFloatY(Math.sin(elapsed * 1.2 + index * 0.8) * 3);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(frame);
    };
  }, [index]);

  return (
    <div
      className="relative z-10"
      style={{
        width: 48,
        height: 48,
        marginTop: 0,
        transform: `translateY(${floatY}px)`,
        opacity: isVisible ? 1 : 0.3,
        transition: 'opacity 0.4s ease',
      }}
    >
      <div
        className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: isDarkMode
            ? 'rgba(15,23,42,0.85)'
            : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: `2px solid ${PRIMARY}`,
          boxShadow: isDarkMode
            ? `0 0 12px ${PRIMARY}40, 0 4px 16px rgba(0,0,0,0.2)`
            : `0 0 12px ${PRIMARY}20, 0 4px 16px rgba(0,0,0,0.06)`,
          transform: isActive ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.4s ease',
        }}
      >
        {item.logo ? (
          <img
            src={item.logo}
            alt={item.company || 'logo'}
            className="w-3/5 h-3/5 object-contain"
            loading="lazy"
          />
        ) : (
          <span
            className="text-base sm:text-lg font-semibold"
            style={{ color: PRIMARY }}
          >
            {(item.company || item.organization || '?')[0]}
          </span>
        )}
      </div>
    </div>
  );
});
