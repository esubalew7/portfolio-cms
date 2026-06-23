import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { GALAXY } from '../../utils/skillGalaxyConfig';

function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.1, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.3)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

function generateConstellationLines(count, spread) {
  const points = [];
  for (let i = 0; i < 30; i++) {
    const a = new THREE.Vector3(
      (Math.random() - 0.5) * spread * 0.7,
      (Math.random() - 0.5) * spread * 0.7,
      (Math.random() - 0.5) * spread * 0.3
    );
    const b = new THREE.Vector3(
      (Math.random() - 0.5) * spread * 0.7,
      (Math.random() - 0.5) * spread * 0.7,
      (Math.random() - 0.5) * spread * 0.3
    );
    if (a.distanceTo(b) < spread * 0.35 && a.distanceTo(b) > 0.5) {
      points.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }
  return new Float32Array(points);
}

export const GalaxyBackground = React.memo(() => {
  const { isDarkMode } = useTheme();
  const pointsRef = useRef();
  const linesRef = useRef();
  const velRef = useRef([]);
  const cfg = GALAXY.particles;

  const texture = useMemo(() => createGlowTexture(), []);

  const [positions, sizes, colors, linePositions] = useMemo(() => {
    const count = cfg.count;
    const spread = cfg.spread;
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    const darkP = ['#3b82f6', '#60a5fa', '#8b5cf6', '#22c55e', '#f97316'];
    const lightP = ['#93c5fd', '#a5b4fc', '#c4b5fd', '#86efac', '#fdba74'];
    const palette = isDarkMode ? darkP : lightP;
    const colorSet = palette.map((c) => new THREE.Color(c));

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const layer = Math.floor(Math.random() * 3);
      const layerSpread = spread * (1 - layer * 0.15);
      pos[i3] = (Math.random() - 0.5) * layerSpread;
      pos[i3 + 1] = (Math.random() - 0.5) * layerSpread;
      pos[i3 + 2] = (Math.random() - 0.5) * spread * 0.4 - layer * 2;

      siz[i] = cfg.sizeRange[0] + Math.random() * (cfg.sizeRange[1] - cfg.sizeRange[0]) * (1 + layer * 0.4);

      vel[i3] = (Math.random() - 0.5) * 0.004 * (1 + layer * 0.5);
      vel[i3 + 1] = (Math.random() - 0.5) * 0.004 * (1 + layer * 0.5);
      vel[i3 + 2] = (Math.random() - 0.5) * 0.002 * (1 + layer * 0.5);

      const c = colorSet[Math.floor(Math.random() * colorSet.length)];
      col[i3] = c.r * (1 - layer * 0.15);
      col[i3 + 1] = c.g * (1 - layer * 0.15);
      col[i3 + 2] = c.b * (1 - layer * 0.15);
    }

    velRef.current = vel;

    const lines = generateConstellationLines(30, spread);
    return [pos, siz, col, lines];
  }, [isDarkMode, cfg]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position;
    const array = pos.array;
    const vel = velRef.current;
    const halfSpread = cfg.spread / 2;
    const depthHalf = cfg.spread * 0.2;

    for (let i = 0; i < cfg.count; i++) {
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
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={cfg.count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={cfg.count} array={sizes} itemSize={1} />
          <bufferAttribute attach="attributes-color" count={cfg.count} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          map={texture}
          transparent
          opacity={cfg.opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
          vertexColors
        />
      </points>
      {linePositions.length > 0 && (
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={linePositions.length / 3}
              array={linePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={isDarkMode ? '#3b82f6' : '#93c5fd'}
            transparent
            opacity={0.04}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      )}
    </>
  );
});
