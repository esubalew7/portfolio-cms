import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

export const ParticleField = React.memo(({ isMobile = false }) => {
  const { isDarkMode } = useTheme();
  const count = isMobile ? 80 : 280; // Highly optimized particle count

  const [positions, sizes, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const col = new Float32Array(count * 3);

    const darkColors = ['#3b82f6', '#60a5fa', '#818cf8', '#38bdf8'].map(c => new THREE.Color(c));
    const lightColors = ['#2563eb', '#3b82f6', '#6366f1', '#0284c7'].map(c => new THREE.Color(c));
    const palette = isDarkMode ? darkColors : lightColors;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spherical distribution around architectural center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.8 + Math.random() * 3.2;

      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi) * 0.7; // slight Z compression for depth

      siz[i] = 0.025 + Math.random() * 0.035;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i3] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;
    }

    return [pos, siz, col];
  }, [count, isDarkMode]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={isDarkMode ? 0.6 : 0.45}
        blending={isDarkMode ? THREE.AdditiveBlending : THREE.NormalBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
});

export default ParticleField;
