import React, { useRef, useMemo, useContext } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useTheme } from '../../context/ThemeContext';
import { TECH_ITEMS, ORBIT, THEME_COLORS } from '../../utils/hero3dConfig';
import { MouseContext } from './DeveloperLogo3D';

const TechLabel = React.memo(({ tech, config, isDarkMode }) => {
  const ref = useRef();
  const { orbitRadius, speed, phase, verticalOffset } = config;
  const dotRef = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const angle = state.clock.elapsedTime * speed + phase;
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;
    ref.current.position.set(x, verticalOffset, z);
    if (dotRef.current) {
      dotRef.current.position.set(x, verticalOffset, z);
    }
  });

  const color = isDarkMode ? THEME_COLORS.dark.accent : THEME_COLORS.light.accent;

  return (
    <>
      <group ref={dotRef}>
        <mesh>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      </group>
      <group ref={ref}>
        <Text
          fontSize={0.18}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.005}
          outlineColor={isDarkMode ? '#0a0a1a' : '#ffffff'}
          transparent
          opacity={0.45}
        >
          {tech}
        </Text>
      </group>
    </>
  );
});

export const TechOrbitSystem = React.memo(() => {
  const { isDarkMode } = useTheme();
  const mouse = useContext(MouseContext);
  const groupRef = useRef();
  const colors = isDarkMode ? THEME_COLORS.dark : THEME_COLORS.light;

  const orbitConfigs = useMemo(() => {
    const radii = [ORBIT.minRadius, (ORBIT.minRadius + ORBIT.maxRadius) / 2, ORBIT.maxRadius];
    return TECH_ITEMS.map((_, index) => ({
      orbitRadius: radii[index % 3],
      speed: ORBIT.baseSpeed + index * 0.015,
      phase: (index / TECH_ITEMS.length) * Math.PI * 2,
      verticalOffset: Math.sin((index / TECH_ITEMS.length) * Math.PI * 2) * ORBIT.verticalSpread,
    }));
  }, []);

  const ringRadii = useMemo(
    () => [0, 1, 2].map((i) => ORBIT.minRadius + i * ((ORBIT.maxRadius - ORBIT.minRadius) / 2)),
    []
  );

  useFrame(() => {
    if (!groupRef.current) return;
    if (mouse?.current) {
      groupRef.current.rotation.x = mouse.current.y * 0.008;
      groupRef.current.rotation.z = mouse.current.x * 0.008;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.3, -1]}>
      {ringRadii.map((radius, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={65}
              array={(() => {
                const pts = new Float32Array(65 * 3);
                for (let j = 0; j <= 64; j++) {
                  const theta = (j / 64) * Math.PI * 2;
                  pts[j * 3] = Math.cos(theta) * radius;
                  pts[j * 3 + 1] = 0;
                  pts[j * 3 + 2] = Math.sin(theta) * radius;
                }
                return pts;
              })()}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={colors.orbitLineColor} transparent opacity={0.06 + i * 0.03} />
        </line>
      ))}
      {orbitConfigs.map((config, index) => (
        <TechLabel key={TECH_ITEMS[index]} tech={TECH_ITEMS[index]} config={config} isDarkMode={isDarkMode} />
      ))}
    </group>
  );
});
