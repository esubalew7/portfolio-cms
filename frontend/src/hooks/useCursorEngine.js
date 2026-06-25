import { useEffect, useRef, useCallback } from 'react';
import { CURSOR } from '../utils/cursorConfig';
import { useCursorPhysics } from './useCursorPhysics';
import { useCursorState } from './useCursorState';

export function useCursorEngine() {
  const rafRef = useRef(null);
  const mountedRef = useRef(true);
  const scrollYRef = useRef(0);
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef(null);
  const { cursorState, setCursorState, resetCursorState } = useCursorState();
  const physics = useCursorPhysics(CURSOR.physics);

  const { state: posRef, updateTarget, tick, setCompress, lerp } = physics;

  const handleScroll = useCallback(() => {
    const delta = Math.abs(window.scrollY - scrollYRef.current);
    scrollYRef.current = window.scrollY;

    if (!isScrollingRef.current) {
      isScrollingRef.current = true;
    }

    const compress = Math.max(0.85, 1 - Math.min(delta * 0.002, 0.15));
    setCompress(compress);

    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      setCompress(1);
    }, 150);
  }, [setCompress]);

  useEffect(() => {
    mountedRef.current = true;

    const loop = () => {
      if (!mountedRef.current) return;
      tick();
      rafRef.current = requestAnimationFrame(loop);
    };

    const onMouse = (e) => {
      updateTarget(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, [updateTarget, tick, handleScroll]);

  return {
    posRef,
    physics,
    cursorState,
    setCursorState,
    resetCursorState,
  };
}
