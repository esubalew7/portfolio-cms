import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { CAMERA } from '../../utils/hero3dConfig';
import { HeroScene } from './HeroScene';

function Fallback() {
  return null;
}

export const HeroCanvas = React.memo(() => {
  const glProps = useMemo(() => ({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
  }), []);

  return (
    <Canvas
      camera={CAMERA}
      dpr={[1, 1.5]}
      gl={glProps}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <Suspense fallback={<Fallback />}>
        <HeroScene />
        <AdaptiveDpr pixelated />
      </Suspense>
    </Canvas>
  );
});
