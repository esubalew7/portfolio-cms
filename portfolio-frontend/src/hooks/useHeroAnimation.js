import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function useFloatAnimation(speed = 1, amplitude = 0.3, axis = 'y') {
  const ref = useRef();
  const initialPos = useRef(null);

  useFrame((state) => {
    if (!ref.current) return;
    if (!initialPos.current) {
      initialPos.current = ref.current.position.clone();
    }
    const t = state.clock.elapsedTime * speed;
    const offset = Math.sin(t) * amplitude;
    ref.current.position[axis] = initialPos.current[axis] + offset;
  });

  return ref;
}

export function useOrbitAnimation(speed = 0.1, radius = 1, phase = 0) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const angle = state.clock.elapsedTime * speed + phase;
    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.z = Math.sin(angle) * radius;
  });

  return ref;
}
