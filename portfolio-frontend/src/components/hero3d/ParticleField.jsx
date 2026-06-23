import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { PARTICLE_CONFIG, THEME_COLORS } from '../../utils/hero3dConfig';

function createParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.15, 'rgba(255,255,255,0.9)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.4)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(canvas);
}

export const ParticleField = React.memo(() => {
  const { isDarkMode } = useTheme();
  const pointsRef = useRef();
  const velRef = useRef([]);
  const count = PARTICLE_CONFIG.count;
  const spread = PARTICLE_CONFIG.spread;

  const texture = useMemo(() => createParticleTexture(), []);

  const [positions, sizes, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const theme = isDarkMode ? THEME_COLORS.dark : THEME_COLORS.light;
    const colorSet = theme.particleColors.map((c) => new THREE.Color(c));

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const depthLayer = Math.floor(Math.random() * 3);
      const depthSpread = spread * (1 - depthLayer * 0.2);
      pos[i3] = (Math.random() - 0.5) * depthSpread;
      pos[i3 + 1] = (Math.random() - 0.5) * depthSpread;
      pos[i3 + 2] = (Math.random() - 0.5) * spread * 0.5 - depthLayer * 1.5;

      siz[i] = PARTICLE_CONFIG.sizeRange[0] + Math.random() * (PARTICLE_CONFIG.sizeRange[1] - PARTICLE_CONFIG.sizeRange[0]) * (1 + depthLayer * 0.3);
      vel[i3] = (Math.random() - 0.5) * 0.008 * (1 + depthLayer * 0.5);
      vel[i3 + 1] = (Math.random() - 0.5) * 0.008 * (1 + depthLayer * 0.5);
      vel[i3 + 2] = (Math.random() - 0.5) * 0.004 * (1 + depthLayer * 0.5);

      const c = colorSet[Math.floor(Math.random() * colorSet.length)];
      col[i3] = c.r * (1 - depthLayer * 0.2);
      col[i3 + 1] = c.g * (1 - depthLayer * 0.2);
      col[i3 + 2] = c.b * (1 - depthLayer * 0.2);
    }

    velRef.current = vel;
    return [pos, siz, col];
  }, [isDarkMode, count, spread]);

  useEffect(() => {
    if (pointsRef.current) {
      const colorAttr = pointsRef.current.geometry.attributes.color;
      if (colorAttr) {
        const theme = isDarkMode ? THEME_COLORS.dark : THEME_COLORS.light;
        const colorSet = theme.particleColors.map((c) => new THREE.Color(c));
        const col = colorAttr.array;
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          const c = colorSet[Math.floor(Math.random() * colorSet.length)];
          const depthLayer = Math.floor(Math.abs(pointsRef.current.geometry.attributes.position.array[i3 + 2] / 2.5));
          col[i3] = c.r * (1 - Math.min(depthLayer, 2) * 0.2);
          col[i3 + 1] = c.g * (1 - Math.min(depthLayer, 2) * 0.2);
          col[i3 + 2] = c.b * (1 - Math.min(depthLayer, 2) * 0.2);
        }
        colorAttr.needsUpdate = true;
      }
    }
  }, [isDarkMode, count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position;
    const array = pos.array;
    const vel = velRef.current;
    const halfSpread = spread / 2;
    const depthHalf = spread * 0.25;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      array[i3] += vel[i3];
      array[i3 + 1] += vel[i3 + 1];
      array[i3 + 2] += vel[i3 + 2];

      if (array[i3] > halfSpread || array[i3] < -halfSpread) vel[i3] *= -1;
      if (array[i3 + 1] > halfSpread || array[i3 + 1] < -halfSpread) vel[i3 + 1] *= -1;
      if (array[i3 + 2] > depthHalf || array[i3 + 2] < -depthHalf) vel[i3 + 2] *= -1;
    }

    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        map={texture}
        transparent
        opacity={PARTICLE_CONFIG.opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
        vertexColors
      />
    </points>
  );
});
