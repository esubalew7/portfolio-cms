import React, { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { TechConstellation } from './TechConstellation';
import { ParticleField } from './ParticleField';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { useTheme } from '../../context/ThemeContext';

function SceneLighting({ isDarkMode }) {
  return (
    <>
      <ambientLight intensity={isDarkMode ? 0.35 : 0.65} />
      <directionalLight
        position={[6, 8, 7]}
        intensity={isDarkMode ? 1.6 : 1.2}
        color={isDarkMode ? '#93c5fd' : '#ffffff'}
      />
      <directionalLight
        position={[-6, -4, -4]}
        intensity={isDarkMode ? 0.8 : 0.4}
        color={isDarkMode ? '#818cf8' : '#3b82f6'}
      />
    </>
  );
}

export const HeroCanvas = React.memo(() => {
  const { isDarkMode } = useTheme();
  const mouseRef = useMouseParallax(0.04);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile & viewport visibility
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });

    // IntersectionObserver to pause rendering when scrolled out of viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  const glProps = useMemo(() => ({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
  }), []);

  // If container is scrolled far offscreen, halt Canvas
  if (!isVisible) {
    return <div ref={containerRef} className="w-full h-full" />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] lg:h-[600px] flex items-center justify-center select-none pointer-events-auto"
    >
      {/* Ambient background glow backdrop */}
      <div
        className="absolute inset-0 rounded-full bg-radial-glow opacity-75 pointer-events-none"
        aria-hidden="true"
      />

      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 38 }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)]}
        gl={glProps}
        frameloop="always"
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
        }}
      >
        <Suspense fallback={null}>
          <SceneLighting isDarkMode={isDarkMode} />
          <TechConstellation mouseRef={mouseRef} />
          <ParticleField isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
});

export default HeroCanvas;
