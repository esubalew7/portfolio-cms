import { useRef, useEffect } from 'react';

/**
 * Tracks normalized mouse position (-1 to +1) across viewport with smooth lerp damping.
 * Uses requestAnimationFrame instead of R3F's useFrame so it can safely be called
 * anywhere in the React component tree (outside or inside <Canvas>).
 */
export function useMouseParallax(smoothing = 0.04) {
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animId;

    const handleMouseMove = (e) => {
      if (typeof window === 'undefined') return;
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const updateLoop = () => {
      current.current.x += (target.current.x - current.current.x) * smoothing;
      current.current.y += (target.current.y - current.current.y) * smoothing;
      animId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animId) {
        cancelAnimationFrame(animId);
      }
    };
  }, [smoothing]);

  return current;
}

export default useMouseParallax;
