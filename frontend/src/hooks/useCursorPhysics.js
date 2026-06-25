import { useRef, useCallback } from 'react';

const lerp = (current, target, factor) => current + (target - current) * factor;

export function useCursorPhysics(config) {
  const state = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    velocityX: 0,
    velocityY: 0,
    velocity: 0,
    prevTargetX: 0,
    prevTargetY: 0,
    scale: 1,
    targetScale: 1,
    ringRotation: 0,
    glowIntensity: 1,
    compressY: 1,
  });

  const updateTarget = useCallback((clientX, clientY) => {
    const s = state.current;
    s.prevTargetX = s.targetX;
    s.prevTargetY = s.targetY;
    s.targetX = clientX;
    s.targetY = clientY;
  }, []);

  const tick = useCallback(() => {
    const s = state.current;

    const rawDx = s.targetX - s.prevTargetX;
    const rawDy = s.targetY - s.prevTargetY;
    const rawVelocity = Math.sqrt(rawDx * rawDx + rawDy * rawDy);

    s.velocityX = lerp(s.velocityX, rawDx * 0.6, 0.3);
    s.velocityY = lerp(s.velocityY, rawDy * 0.6, 0.3);
    s.velocity = lerp(s.velocity, rawVelocity * 0.6, 0.3);

    s.x = lerp(s.x, s.targetX, config.positionLerp);
    s.y = lerp(s.y, s.targetY, config.positionLerp);

    s.scale = lerp(s.scale, s.targetScale, 0.12);
    s.compressY = lerp(s.compressY, 1, 0.1);

    s.ringRotation += config.rotationSpeed || 0.3;
    s.glowIntensity = lerp(s.glowIntensity, 1, 0.08);
  }, [config]);

  const setScale = useCallback((target) => {
    state.current.targetScale = target;
  }, []);

  const setCompress = useCallback((factor) => {
    state.current.compressY = factor;
  }, []);

  return { state, updateTarget, tick, setScale, setCompress, lerp };
}
