import React, { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const GalaxyLighting = React.memo(() => {
  const { isDarkMode } = useTheme();

  const lights = useMemo(() => ({
    ambient: { intensity: isDarkMode ? 0.2 : 0.4 },
    hemisphere: {
      skyColor: isDarkMode ? '#0f1a3a' : '#dbeafe',
      groundColor: isDarkMode ? '#050510' : '#f1f5f9',
      intensity: isDarkMode ? 0.4 : 0.3,
    },
    key: {
      position: [6, 5, 8],
      intensity: isDarkMode ? 2.5 : 1.6,
      color: isDarkMode ? '#3b82f6' : '#2563eb',
    },
    rim: {
      position: [-7, 2, -5],
      intensity: isDarkMode ? 1.8 : 0.9,
      color: isDarkMode ? '#8b5cf6' : '#7c3aed',
    },
    fill: {
      position: [0, -6, 7],
      intensity: isDarkMode ? 0.8 : 0.5,
      color: isDarkMode ? '#06b6d4' : '#0891b2',
    },
    accent: {
      position: [4, 6, -7],
      intensity: isDarkMode ? 1.4 : 0.7,
      color: isDarkMode ? '#f59e0b' : '#d97706',
    },
    bottom: {
      position: [0, -8, 0],
      intensity: isDarkMode ? 0.5 : 0.3,
      color: isDarkMode ? '#6366f1' : '#4f46e5',
    },
  }), [isDarkMode]);

  return (
    <>
      <ambientLight intensity={lights.ambient.intensity} />
      <hemisphereLight
        args={[lights.hemisphere.skyColor, lights.hemisphere.groundColor, lights.hemisphere.intensity]}
      />
      <directionalLight
        position={lights.key.position}
        intensity={lights.key.intensity}
        color={lights.key.color}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />
      <pointLight
        position={lights.rim.position}
        intensity={lights.rim.intensity}
        color={lights.rim.color}
        distance={30}
        decay={2}
      />
      <pointLight
        position={lights.fill.position}
        intensity={lights.fill.intensity}
        color={lights.fill.color}
        distance={30}
        decay={2}
      />
      <pointLight
        position={lights.accent.position}
        intensity={lights.accent.intensity}
        color={lights.accent.color}
        distance={25}
        decay={2}
      />
      <pointLight
        position={lights.bottom.position}
        intensity={lights.bottom.intensity}
        color={lights.bottom.color}
        distance={20}
        decay={2}
      />
    </>
  );
});
