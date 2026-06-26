import { useEffect, useRef, useCallback } from 'react';
import { CURSOR } from '../utils/cursorConfig';

export function useCursor() {
  const coreRef = useRef(null);
  const ringRef = useRef(null);

  const pos = useRef({
    x: 0, y: 0,
    targetX: 0, targetY: 0,
    scale: 1,
    targetScale: 1,
    ringScale: 1,
    targetRingScale: 1,
  });

  const rafRef = useRef(null);

  const setCoreRef = useCallback((el) => { coreRef.current = el; }, []);
  const setRingRef = useCallback((el) => { ringRef.current = el; }, []);

  const updateTarget = useCallback((e) => {
    const p = pos.current;
    p.targetX = e.clientX;
    p.targetY = e.clientY;
  }, []);

  const setInteraction = useCallback((stateName) => {
    const group = stateName === 'click' ? 'click' : 'hover';
    const config = CURSOR.interactionScale[group] || CURSOR.interactionScale.default;
    const p = pos.current;
    p.targetScale = config.scale;
    p.targetRingScale = config.ringScale;
  }, []);

  const resetInteraction = useCallback(() => {
    const p = pos.current;
    p.targetScale = 1;
    p.targetRingScale = 1;
  }, []);

  useEffect(() => {
    const LERP = CURSOR.physics.positionLerp;
    const S_LERP = CURSOR.physics.scaleLerp;
    const R_LERP = CURSOR.physics.ringScaleLerp;
    const CORE_SIZE = CURSOR.core.restSize;
    const RING_SIZE = CURSOR.ring.restSize;

    let running = true;

    const loop = () => {
      if (!running) return;
      const p = pos.current;

      p.x += (p.targetX - p.x) * LERP;
      p.y += (p.targetY - p.y) * LERP;
      p.scale += (p.targetScale - p.scale) * S_LERP;
      p.ringScale += (p.targetRingScale - p.ringScale) * R_LERP;

      const coreSize = CORE_SIZE * p.scale;
      const ringSize = RING_SIZE * p.ringScale;

      const core = coreRef.current;
      if (core) {
        core.style.transform = `translate3d(${p.x - coreSize / 2}px, ${p.y - coreSize / 2}px, 0)`;
        core.style.width = `${coreSize}px`;
        core.style.height = `${coreSize}px`;
      }

      const ring = ringRef.current;
      if (ring) {
        ring.style.transform = `translate3d(${p.x - ringSize / 2}px, ${p.y - ringSize / 2}px, 0)`;
        ring.style.width = `${ringSize}px`;
        ring.style.height = `${ringSize}px`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    window.addEventListener('mousemove', updateTarget, { passive: true });

    return () => {
      running = false;
      window.removeEventListener('mousemove', updateTarget);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateTarget]);

  return {
    setCoreRef,
    setRingRef,
    pos,
    setInteraction,
    resetInteraction,
  };
}
