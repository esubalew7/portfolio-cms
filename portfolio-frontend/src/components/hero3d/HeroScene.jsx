import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { THEME_COLORS } from '../../utils/hero3dConfig';
import { MouseContext } from './DeveloperLogo3D';
import { ParticleField } from './ParticleField';
import { FloatingGeometry } from './FloatingGeometry';
import { DeveloperLogo3D } from './DeveloperLogo3D';
import { TechOrbitSystem } from './TechOrbitSystem';
import { LightingSystem } from './LightingSystem';

function SceneBackground() {
  const { isDarkMode } = useTheme();
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color(isDarkMode ? THEME_COLORS.dark.background : THEME_COLORS.light.background);
  }, [isDarkMode, scene]);

  return null;
}

export const HeroScene = React.memo(() => {
  const mouse = useMouseParallax(0.035);

  return (
    <MouseContext.Provider value={mouse}>
      <SceneBackground />
      <LightingSystem />
      <ParticleField />
      <FloatingGeometry />
      <DeveloperLogo3D />
      <TechOrbitSystem />
    </MouseContext.Provider>
  );
});
