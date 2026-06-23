import { useRef, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function useGalaxyMotion() {
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const cameraOffset = useRef(new THREE.Vector3(0, 0, 0));
  const progressRef = useRef(0);
  const { camera } = useThree();
  const basePosition = useRef(camera.position.clone());

  const handleMouseMove = useCallback((e) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const setEntranceProgress = useCallback((p) => {
    progressRef.current = p;
  }, []);

  useFrame((_, delta) => {
    const target = new THREE.Vector3(
      mouseRef.current.x * 0.3,
      mouseRef.current.y * 0.2,
      0
    );
    cameraOffset.current.lerp(target, 0.02);
    camera.position.x = basePosition.current.x + cameraOffset.current.x;
    camera.position.y = basePosition.current.y + cameraOffset.current.y;
    camera.position.z = basePosition.current.z + cameraOffset.current.z * 0.1;
    camera.lookAt(0, 0, 0);

    progressRef.current = Math.min(progressRef.current + delta * 0.6, 1);
  });

  return { progressRef, setEntranceProgress };
}
