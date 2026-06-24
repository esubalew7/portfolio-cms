import React, { useRef, useContext, createContext } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import { useTheme } from '../../context/ThemeContext';
import { THEME_COLORS, FONTS } from '../../utils/hero3dConfig';

export const MouseContext = createContext({ current: { x: 0, y: 0 } });

export const DeveloperLogo3D = React.memo(() => {
  const { isDarkMode } = useTheme();
  const groupRef = useRef();
  const mouse = useContext(MouseContext);
  const colors = isDarkMode ? THEME_COLORS.dark : THEME_COLORS.light;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.set(
      4 + Math.sin(t * 0.15) * 0.08,
      1.2 + Math.sin(t * 0.25) * 0.12,
      -1
    );

    if (mouse?.current) {
      groupRef.current.rotation.x = mouse.current.y * 0.03;
      groupRef.current.rotation.y = mouse.current.x * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <Text3D
          font={FONTS.bold}
          size={1.2}
          height={0.12}
          curveSegments={24}
          bevelEnabled
          bevelThickness={0.04}
          bevelSize={0.02}
          bevelSegments={8}
        >
          ESUBALEW
          <meshPhysicalMaterial
            color={colors.textPrimary}
            metalness={0.85}
            roughness={0.12}
            envMapIntensity={1.5}
            clearcoat={0.6}
            clearcoatRoughness={0.15}
            emissive={colors.emissiveColor}
            emissiveIntensity={0.15}
            transparent
            opacity={0.9}
          />
        </Text3D>
      </Center>

      <Center position={[0, -1.0, 0]}>
        <Text3D
          font={FONTS.regular}
          size={0.25}
          height={0.04}
          curveSegments={16}
          bevelEnabled
          bevelThickness={0.01}
          bevelSize={0.005}
          bevelSegments={4}
        >
          Full Stack Developer
          <meshPhysicalMaterial
            color={colors.textSecondary}
            metalness={0.4}
            roughness={0.35}
            transparent
            opacity={0.65}
            emissive={colors.emissiveColor}
            emissiveIntensity={0.05}
          />
        </Text3D>
      </Center>
    </group>
  );
});
