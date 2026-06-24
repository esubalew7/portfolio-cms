import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { GALAXY, getCategoryColor } from '../../utils/skillGalaxyConfig';
import { SkillNode } from './SkillNode';
import { OrbitCenterIcon } from './OrbitCenterIcon';

function OrbitRing({ radius, color, opacity, entranceProgress, index, speedMultiplier }) {
  const ringRef = useRef();
  const totalSpeeds = GALAXY.orbits.speeds;
  const baseSpeed = totalSpeeds[index] || 0.03;

  const points = useMemo(() => {
    const segments = 80;
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  useFrame((state) => {
    if (!ringRef.current) return;
    const speedMod = speedMultiplier !== undefined ? speedMultiplier : 1;
    ringRef.current.rotation.z += baseSpeed * 0.01 * speedMod;
    const progress = Math.min(Math.max((state.clock.elapsedTime - index * 0.3) * 0.5, 0), 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const combinedOpacity = opacity * (entranceProgress !== undefined ? entranceProgress * eased : 1);
    ringRef.current.material.opacity = combinedOpacity;
  });

  return (
    <lineLoop ref={ringRef} geometry={geometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        linewidth={GALAXY.orbits.ringWidth}
      />
    </lineLoop>
  );
}

export const SkillOrbit = React.memo(({
  category,
  orbitIndex,
  entranceProgress,
  isFocused,
  onNodeHover,
}) => {
  const { isDarkMode } = useTheme();
  const groupRef = useRef();
  const radii = GALAXY.orbits.radii;
  const tilts = GALAXY.orbits.tilts;
  const radius = radii[orbitIndex % radii.length];
  const tilt = tilts[orbitIndex % tilts.length];
  const colorSet = getCategoryColor(category.name);
  const color = isDarkMode ? colorSet.primary : colorSet.secondary;
  const [hoveredIndex, setHoveredIndex] = React.useState(-1);
  const items = category.items;

  const nodePositions = useMemo(() => {
    const skillItems = items || [];
    return skillItems.map((_, i) => {
      const angle = (i / skillItems.length) * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: 0,
      };
    });
  }, [items, radius]);

  const handleHover = useCallback((isHovered) => {
    setHoveredIndex(isHovered ? 1 : -1);
    if (onNodeHover) onNodeHover(category.name, isHovered);
  }, [category.name, onNodeHover]);

  const groupOpacity = isFocused !== undefined ? (isFocused ? 1 : 0.15) : 1;
  const speedMultiplier = hoveredIndex >= 0 ? 0.3 : 1;

  return (
    <group ref={groupRef} rotation={[tilt, 0, 0]}>
      <OrbitCenterIcon categoryName={category.name} orbitIndex={orbitIndex} />
      <OrbitRing
        radius={radius}
        color={color}
        opacity={GALAXY.orbits.ringOpacity * groupOpacity}
        entranceProgress={entranceProgress}
        index={orbitIndex}
        speedMultiplier={speedMultiplier}
      />
      {items.map((skill, i) => (
        <SkillNode
          key={`${skill.name}-${i}`}
          position={[nodePositions[i].x, nodePositions[i].y, nodePositions[i].z]}
          skill={skill}
          categoryName={category.name}
          index={i}
          total={items.length}
          orbitIndex={orbitIndex}
          entranceProgress={entranceProgress}
          isFocused={isFocused}
          onHoverChange={handleHover}
        />
      ))}
    </group>
  );
});
