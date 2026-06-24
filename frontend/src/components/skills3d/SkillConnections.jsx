import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { GALAXY, RELATIONSHIPS, getCategoryColor } from '../../utils/skillGalaxyConfig';

function findNodePosition(categories, skillName) {
  for (let ci = 0; ci < categories.length; ci++) {
    const cat = categories[ci];
    const radii = GALAXY.orbits.radii;
    const tilts = GALAXY.orbits.tilts;
    const radius = radii[ci % radii.length];
    const tilt = tilts[ci % tilts.length];
    const items = cat.items || [];
    for (let si = 0; si < items.length; si++) {
      if (items[si].name === skillName) {
        const angle = (si / items.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = 0;
        const rotated = new THREE.Vector3(x, y, z).applyEuler(new THREE.Euler(tilt, 0, 0));
        return rotated;
      }
    }
  }
  return null;
}

function isLineConnected(line, nodeName) {
  if (!nodeName) return false;
  return line.source === nodeName || line.target === nodeName;
}

export const SkillConnections = React.memo(({ categories, entranceProgress, hoveredNode }) => {
  const { isDarkMode } = useTheme();
  const linesRef = useRef();

  const lineData = useMemo(() => {
    const data = [];
    const added = new Set();

    for (const cat of categories) {
      const items = cat.items || [];
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const key = `${items[i].name}-${items[j].name}`;
          const reverseKey = `${items[j].name}-${items[i].name}`;
          if (!added.has(key) && !added.has(reverseKey)) {
            added.add(key);
            const p1 = findNodePosition(categories, items[i].name);
            const p2 = findNodePosition(categories, items[j].name);
            if (p1 && p2) {
              const color = getCategoryColor(cat.name);
              data.push({
                start: p1,
                end: p2,
                color: isDarkMode ? color.primary : color.secondary,
                source: items[i].name,
                target: items[j].name,
                key,
              });
            }
          }
        }
      }
    }

    for (const [source, targets] of Object.entries(RELATIONSHIPS)) {
      for (const target of targets) {
        const key = `rel-${source}-${target}`;
        const reverseKey = `rel-${target}-${source}`;
        if (!added.has(key) && !added.has(reverseKey)) {
          added.add(key);
          const p1 = findNodePosition(categories, source);
          const p2 = findNodePosition(categories, target);
          if (p1 && p2) {
            data.push({
              start: p1,
              end: p2,
              color: isDarkMode ? '#818cf8' : '#6366f1',
              source,
              target,
              key,
            });
          }
        }
      }
    }

    return data;
  }, [categories, isDarkMode]);

  const geometry = useMemo(() => {
    if (lineData.length === 0) return null;
    const positions = [];
    for (const line of lineData) {
      positions.push(line.start.x, line.start.y, line.start.z);
      positions.push(line.end.x, line.end.y, line.end.z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [lineData]);

  const colors = useMemo(() => {
    if (lineData.length === 0) return null;
    const col = [];
    const hasHover = !!hoveredNode;
    for (const line of lineData) {
      let brightness = 1;
      if (hasHover) {
        brightness = isLineConnected(line, hoveredNode.name) ? 1.0 : 0.06;
      }
      const c = new THREE.Color(line.color);
      c.r *= brightness;
      c.g *= brightness;
      c.b *= brightness;
      col.push(c.r, c.g, c.b, c.r, c.g, c.b);
    }
    return new THREE.Float32BufferAttribute(col, 3);
  }, [lineData, hoveredNode]);

  useFrame((state) => {
    if (!linesRef.current || !geometry) return;
    const offset = (state.clock.elapsedTime * GALAXY.connections.animateSpeed) % 1;
    const entrance = entranceProgress !== undefined
      ? Math.min(Math.max((state.clock.elapsedTime - 0.8) * 0.4, 0), 1)
      : 1;
    const eased = 1 - Math.pow(1 - entrance, 3);
    linesRef.current.material.opacity = GALAXY.connections.lineOpacity * eased;
    linesRef.current.material.dashOffset = -offset;
  });

  if (!geometry || !colors || lineData.length === 0) return null;

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineDashedMaterial
        vertexColors
        transparent
        opacity={GALAXY.connections.lineOpacity}
        dashSize={GALAXY.connections.dashSize}
        gapSize={GALAXY.connections.gapSize}
        depthWrite={false}
        linewidth={1}
      />
    </lineSegments>
  );
});
