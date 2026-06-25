import { useRef, useEffect } from 'react';

export function useTimelineProgress() {
  const progressRef = useRef(0);
  const sectionRef = useRef(null);
  const rafRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const tick = () => {
      if (!mountedRef.current) return;
      const section = sectionRef.current;
      if (!section) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const rect = section.getBoundingClientRect();
      const totalH = rect.height;
      const winH = window.innerHeight;
      const visible = Math.min(rect.bottom, winH) - Math.max(rect.top, 0);
      progressRef.current = Math.max(0, Math.min(1, visible / totalH));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      mountedRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { progressRef, sectionRef };
}
