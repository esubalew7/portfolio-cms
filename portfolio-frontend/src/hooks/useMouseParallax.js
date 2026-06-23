import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

export function useMouseParallax(smoothing = 0.04) {
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    current.current.x += (target.current.x - current.current.x) * smoothing;
    current.current.y += (target.current.y - current.current.y) * smoothing;
  });

  return current;
}
