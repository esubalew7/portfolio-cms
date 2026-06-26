import { useEffect, useState, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useCursor } from '../../hooks/useCursor';
import { CursorRing } from './CursorRing';
import { getInteractionState } from '../../utils/cursorInteractions';
import { CURSOR } from '../../utils/cursorConfig';

function shouldDisable() {
  const isTouch =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;
  return isTouch || isMobile || prefersReduced;
}

export function Cursor({ children }) {
  const { isDarkMode } = useTheme();
  const { setCoreRef, setRingRef, setInteraction, resetInteraction } = useCursor();

  const themeColors = isDarkMode ? CURSOR.core.dark : CURSOR.core.light;
  const ringColors = isDarkMode ? CURSOR.ring.dark : CURSOR.ring.light;

  const [enabled, setEnabled] = useState(() => !shouldDisable());

  useEffect(() => {
    const onResize = () => {
      const next = window.innerWidth >= 768;
      setEnabled(next);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('cursor-hidden', enabled);
    return () => document.body.classList.remove('cursor-hidden');
  }, [enabled]);

  const onMouseOver = useCallback((e) => {
    const interaction = getInteractionState(e.target);
    if (interaction) {
      setInteraction(interaction.state);
    }
  }, [setInteraction]);

  const onMouseOut = useCallback((e) => {
    const related = e.relatedTarget;
    if (!related || !related.closest) {
      resetInteraction();
      return;
    }
    const interaction = getInteractionState(e.target);
    const relatedInteraction = getInteractionState(related);
    if (interaction && (!relatedInteraction || relatedInteraction.state !== interaction.state)) {
      resetInteraction();
    }
  }, [resetInteraction]);

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });
    return () => {
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, [enabled, onMouseOver, onMouseOut]);

  if (!enabled) return <>{children}</>;

  return (
    <>
      <CursorRing ref={setRingRef} colors={ringColors} />
      <div
        ref={setCoreRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${themeColors.color}, rgba(255,255,255,0.2))`,
          boxShadow: `0 0 6px ${themeColors.glow}`,
          willChange: 'transform, width, height',
          transition: 'box-shadow 0.15s ease, background 0.15s ease',
        }}
      />
      {children}
    </>
  );
}
