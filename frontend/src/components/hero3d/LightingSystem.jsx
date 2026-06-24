import React, { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const LightingSystem = React.memo(() => {
  const { isDarkMode } = useTheme();

  const lights = useMemo(() => ({
    ambient: { intensity: isDarkMode ? 0.25 : 0.45 },
    hemisphere: {
      skyColor: isDarkMode ? '#1e3a5f' : '#e0e7ff',
      groundColor: isDarkMode ? '#0a0a1a' : '#f8f9fa',
      intensity: isDarkMode ? 0.5 : 0.35,
    },
    key: {
      position: [5, 6, 7],
      intensity: isDarkMode ? 2.2 : 1.4,
      color: isDarkMode ? '#60a5fa' : '#3b82f6',
    },
    rim: {
      position: [-6, 3, -4],
      intensity: isDarkMode ? 1.5 : 0.8,
      color: isDarkMode ? '#8b5cf6' : '#818cf8',
    },
    fill: {
      position: [0, -5, 6],
      intensity: isDarkMode ? 0.7 : 0.4,
      color: isDarkMode ? '#06b6d4' : '#22d3ee',
    },
    accent: {
      position: [3, 5, -6],
      intensity: isDarkMode ? 1.2 : 0.6,
      color: isDarkMode ? '#3b82f6' : '#60a5fa',
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
        distance={25}
        decay={2}
      />
      <pointLight
        position={lights.fill.position}
        intensity={lights.fill.intensity}
        color={lights.fill.color}
        distance={25}
        decay={2}
      />
      <pointLight
        position={lights.accent.position}
        intensity={lights.accent.intensity}
        color={lights.accent.color}
        distance={20}
        decay={2}
      />
    </>
  );
});
