import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { GEOMETRY_ELEMENTS, THEME_COLORS } from '../../utils/hero3dConfig';

function GeometryShape({ config, isDarkMode }) {
  const ref = useRef();
  const initialPos = useRef(null);

  const glassProps = useMemo(() => ({
    transmission: 0.95,
    roughness: 0.05,
    metalness: 0.02,
    ior: 1.5,
    thickness: 0.3,
    chromaticAberration: 0.015,
    backside: true,
    backsideThickness: 0.2,
    clearcoat: 0.1,
    blur: 0.2,
    color: isDarkMode ? '#60a5fa' : '#3b82f6',
    bg: isDarkMode ? '#0a0a1a' : '#f8f9fa',
  }), [isDarkMode]);

  useFrame((state) => {
    if (!ref.current) return;
    if (!initialPos.current) {
      initialPos.current = new THREE.Vector3(...config.position);
    }
    const t = state.clock.elapsedTime * config.speed;
    ref.current.position.x = initialPos.current.x + Math.sin(t * 0.6) * 0.25;
    ref.current.position.y = initialPos.current.y + Math.sin(t * 0.8) * 0.25;
    ref.current.position.z = initialPos.current.z + Math.cos(t * 0.5) * 0.15;

    ref.current.rotation.x = Math.sin(t * 0.4) * 0.15;
    ref.current.rotation.y = t * 0.2;
    ref.current.rotation.z = Math.cos(t * 0.3) * 0.08;
  });

  const wireColor = isDarkMode ? THEME_COLORS.dark.wireframeColor : THEME_COLORS.light.wireframeColor;

  const geomArgs = useMemo(() => {
    switch (config.type) {
      case 'torus': return [config.size, config.size * 0.4, 16, 32];
      case 'octahedron': return [config.size, 0];
      case 'sphere': return [config.size, 24, 24];
      default: return [config.size, 1];
    }
  }, [config.type, config.size]);

  const Geo = config.type;

  if (config.wireframe) {
    return (
      <mesh ref={ref} position={config.position}>
        {Geo === 'icosahedron' && <icosahedronGeometry args={geomArgs} />}
        {Geo === 'torus' && <torusGeometry args={geomArgs} />}
        {Geo === 'octahedron' && <octahedronGeometry args={geomArgs} />}
        {Geo === 'sphere' && <sphereGeometry args={geomArgs} />}
        <meshPhysicalMaterial
          wireframe
          color={wireColor}
          transparent
          opacity={0.15}
          emissive={wireColor}
          emissiveIntensity={0.03}
        />
      </mesh>
    );
  }

  return (
    <mesh ref={ref} position={config.position}>
      {Geo === 'icosahedron' && <icosahedronGeometry args={geomArgs} />}
      {Geo === 'torus' && <torusGeometry args={geomArgs} />}
      {Geo === 'octahedron' && <octahedronGeometry args={geomArgs} />}
      {Geo === 'sphere' && <sphereGeometry args={geomArgs} />}
      <MeshTransmissionMaterial {...glassProps} />
    </mesh>
  );
}

export const FloatingGeometry = React.memo(() => {
  const { isDarkMode } = useTheme();
  return (
    <group>
      {GEOMETRY_ELEMENTS.map((config, index) => (
        <GeometryShape key={index} config={config} isDarkMode={isDarkMode} />
      ))}
    </group>
  );
});
