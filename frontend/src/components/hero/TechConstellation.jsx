import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// Architectural system nodes mapped in 3D space (System Architecture topology)
const SYSTEM_NODES = [
  { id: 'gateway', label: 'API Gateway', pos: [0, 1.8, 0], scale: 0.24, tier: 'ingress' },
  { id: 'events', label: 'Event Engine', pos: [1.6, 0.9, 0.6], scale: 0.19, tier: 'pipeline' },
  { id: 'state', label: 'Distributed State', pos: [-1.6, 0.9, -0.4], scale: 0.19, tier: 'cache' },
  { id: 'core', label: 'Domain Core', pos: [0, 0, 0.2], scale: 0.32, tier: 'compute' },
  { id: 'services', label: 'Microservices', pos: [1.4, -1.1, -0.5], scale: 0.2, tier: 'services' },
  { id: 'persistence', label: 'Persistence Store', pos: [-1.4, -1.1, 0.5], scale: 0.22, tier: 'database' },
  { id: 'realtime', label: 'WebSocket Hub', pos: [0, -1.8, -0.2], scale: 0.18, tier: 'edge' },
  { id: 'telemetry', label: 'Telemetry & Auth', pos: [-0.7, 0.4, 1.1], scale: 0.16, tier: 'security' },
  { id: 'queue', label: 'Message Broker', pos: [0.7, -0.4, 1.0], scale: 0.17, tier: 'broker' },
];

// Architectural pipeline connections
const TOPOLOGY_EDGES = [
  ['gateway', 'events'],
  ['gateway', 'state'],
  ['gateway', 'core'],
  ['events', 'core'],
  ['state', 'core'],
  ['core', 'services'],
  ['core', 'persistence'],
  ['core', 'realtime'],
  ['events', 'queue'],
  ['queue', 'services'],
  ['state', 'persistence'],
  ['services', 'persistence'],
  ['services', 'realtime'],
  ['persistence', 'realtime'],
  ['telemetry', 'core'],
  ['telemetry', 'gateway'],
  ['telemetry', 'state'],
  ['queue', 'core'],
];

export const TechConstellation = React.memo(({ mouseRef }) => {
  const { isDarkMode } = useTheme();
  const groupRef = useRef(null);
  const coreLightRef = useRef(null);
  const coreMeshRef = useRef(null);

  // Colors based on theme
  const colors = useMemo(() => ({
    accent: isDarkMode ? '#3b82f6' : '#2563eb',
    secondary: isDarkMode ? '#818cf8' : '#4f46e5',
    emissive: isDarkMode ? '#1e40af' : '#60a5fa',
    glassTint: isDarkMode ? '#0f172a' : '#f8fafc',
    wire: isDarkMode ? 'rgba(96, 165, 250, 0.45)' : 'rgba(37, 99, 235, 0.35)',
    pulse: isDarkMode ? '#60a5fa' : '#3b82f6',
  }), [isDarkMode]);

  // Generate connection line buffer geometries
  const connectionGeometry = useMemo(() => {
    const nodeMap = new Map(SYSTEM_NODES.map(n => [n.id, new THREE.Vector3(...n.pos)]));
    const points = [];

    for (const [fromId, toId] of TOPOLOGY_EDGES) {
      const p1 = nodeMap.get(fromId);
      const p2 = nodeMap.get(toId);
      if (p1 && p2) {
        points.push(p1.x, p1.y, p1.z);
        points.push(p2.x, p2.y, p2.z);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);

  // Frame loop: Strictly NO idle rotation, NO bobbing! Only smooth cursor parallax & breathing glow
  useFrame((state) => {
    if (!groupRef.current) return;

    // 1. Cursor Parallax (Max 6 degrees = ~0.105 radians)
    const mx = mouseRef?.current ? mouseRef.current.x : (state.pointer?.x || 0);
    const my = mouseRef?.current ? mouseRef.current.y : (state.pointer?.y || 0);
    const targetRotX = -my * 0.10; // Max ~5.7 degrees
    const targetRotY = mx * 0.10;
    
    // Smooth damp interpolation
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);

    // 2. Breathing Illumination (Soft intensity pulse on core node)
    const t = state.clock.elapsedTime;
    const pulse = Math.sin(t * 1.4) * 0.25 + 0.85; // Bounded between 0.6 and 1.1

    if (coreLightRef.current) {
      coreLightRef.current.intensity = pulse * (isDarkMode ? 2.2 : 1.4);
    }

    if (coreMeshRef.current?.material) {
      coreMeshRef.current.material.emissiveIntensity = pulse * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Breathing Core Light */}
      <pointLight
        ref={coreLightRef}
        color={colors.accent}
        intensity={isDarkMode ? 2.0 : 1.2}
        distance={6}
        decay={2}
      />

      {/* Architectural Wireframe Connections */}
      <lineSegments geometry={connectionGeometry}>
        <lineBasicMaterial
          color={colors.wire}
          transparent
          opacity={isDarkMode ? 0.35 : 0.25}
          blending={isDarkMode ? THREE.AdditiveBlending : THREE.NormalBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Interconnected System Nodes */}
      {SYSTEM_NODES.map((node) => {
        const isCore = node.id === 'core';
        return (
          <group key={node.id} position={node.pos}>
            {/* Specular Polyhedral Glass Node Shell */}
            <mesh ref={isCore ? coreMeshRef : null}>
              <octahedronGeometry args={[node.scale, 0]} />
              <meshPhysicalMaterial
                color={colors.glassTint}
                roughness={0.12}
                metalness={0.15}
                transmission={0.88}
                ior={1.5}
                thickness={0.4}
                transparent
                opacity={0.85}
                emissive={colors.accent}
                emissiveIntensity={isCore ? 0.35 : 0.1}
                wireframe={false}
              />
            </mesh>

            {/* Specular Facet Edge Ring */}
            <mesh>
              <octahedronGeometry args={[node.scale * 1.02, 0]} />
              <meshBasicMaterial
                color={colors.pulse}
                wireframe
                transparent
                opacity={isDarkMode ? 0.5 : 0.3}
              />
            </mesh>

            {/* Glowing Inner Beacon Point */}
            <mesh>
              <sphereGeometry args={[node.scale * 0.35, 12, 12]} />
              <meshBasicMaterial
                color={isCore ? colors.accent : colors.secondary}
                transparent
                opacity={0.9}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
});

export default TechConstellation;
