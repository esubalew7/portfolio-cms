import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { GALAXY } from '../../utils/skillGalaxyConfig';

const InnerSphere = React.memo(({ isDarkMode, radius }) => {
  const meshRef = useRef();
  const cfg = GALAXY.core.material;

  const materialProps = useMemo(() => ({
    transmissionSampler: false,
    thickness: cfg.thickness,
    roughness: cfg.roughness,
    metalness: cfg.metalness,
    ior: cfg.ior,
    chromaticAberration: cfg.chromaticAberration,
    anisotropy: cfg.anisotropy,
    color: isDarkMode ? '#1e3a8a' : '#60a5fa',
    envMapIntensity: isDarkMode ? 2.0 : 1.0,
    clearcoat: 0.3,
    clearcoatRoughness: 0.2,
  }), [isDarkMode, cfg]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
    meshRef.current.rotation.y += 0.002;
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.015;
    meshRef.current.scale.setScalar(breathe);
  });

  return (
    <mesh ref={meshRef}>
      <dodecahedronGeometry args={[radius, 0]} />
      <MeshTransmissionMaterial {...materialProps} />
    </mesh>
  );
});

const OuterGlow = React.memo(({ isDarkMode, radius }) => {
  const meshRef = useRef();
  const color = isDarkMode ? '#3b82f6' : '#93c5fd';

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    meshRef.current.rotation.y += 0.001;
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.2 + 1) * 0.02;
    meshRef.current.scale.setScalar(breathe);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[radius * 1.6, 1]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.06}
        wireframe
        depthWrite={false}
      />
    </mesh>
  );
});

const RingOrnaments = React.memo(({ isDarkMode, radius }) => {
  const groupRef = useRef();
  const color = isDarkMode ? '#60a5fa' : '#3b82f6';
  const count = 6;

  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius * 2.2;
      pos.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r * 0.3,
        z: Math.sin(angle) * r * 0.3,
      });
    }
    return pos;
  }, [radius]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.003;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.02;
  });

  return (
    <group ref={groupRef}>
      {positions.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
});

export const SkillCore = React.memo(({ label }) => {
  const { isDarkMode } = useTheme();
  const r = GALAXY.core.radius;

  return (
    <group>
      <InnerSphere isDarkMode={isDarkMode} radius={r} />
      <OuterGlow isDarkMode={isDarkMode} radius={r} />
      <RingOrnaments isDarkMode={isDarkMode} radius={r} />
      <Text
        position={[0, -r * 2.5, 0]}
        fontSize={0.25}
        color={isDarkMode ? '#93c5fd' : '#1e3a8a'}
        anchorX="center"
        anchorY="middle"
        transparent
        opacity={0.6}
      >
        {label || 'FULL STACK'}
      </Text>
    </group>
  );
});
