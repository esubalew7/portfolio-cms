import React, { useState, useCallback, useMemo, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { GALAXY } from '../../utils/skillGalaxyConfig';
import { GalaxyInteractionContext } from '../../hooks/useSkillInteraction';
import { GalaxyBackground } from './GalaxyBackground';
import { GalaxyLighting } from './GalaxyLighting';
import { SkillCore } from './SkillCore';
import { SkillOrbit } from './SkillOrbit';
import { SkillConnections } from './SkillConnections';
import { SkillTooltip } from './SkillTooltip';
import { SkillDetailPanel } from './SkillDetailPanel';

function GalaxyScene({ categories, entranceProgress }) {
  return (
    <>
      <GalaxyLighting />
      <GalaxyBackground />
      <SkillCore label="FULL STACK" />
      {categories.map((cat, i) => (
        <SkillOrbit
          key={cat.name}
          category={cat}
          orbitIndex={i}
          entranceProgress={entranceProgress}
        />
      ))}
      <SkillConnections categories={categories} entranceProgress={entranceProgress} />
    </>
  );
}

export const SkillGalaxy = React.memo(({
  categories,
  title,
  subtitle,
  entranceProgress,
}) => {
  const { isDarkMode } = useTheme();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredScreenPos, setHoveredScreenPos] = useState({ x: 0, y: 0 });

  const clearHover = useCallback(() => setHoveredNode(null), []);
  const clearSelection = useCallback(() => setSelectedNode(null), []);

  const ctxValue = useMemo(() => ({
    hoveredNode,
    selectedNode,
    hoveredScreenPos,
    setHoveredNode,
    setSelectedNode,
    setHoveredScreenPos,
    clearHover,
    clearSelection,
  }), [hoveredNode, selectedNode, hoveredScreenPos]);

  const activeCategoryName = useMemo(() => {
    if (hoveredNode) {
      for (const cat of categories) {
        if (cat.items && cat.items.some((item) => item.name === hoveredNode.name)) {
          return cat.name;
        }
      }
    }
    if (selectedNode) {
      for (const cat of categories) {
        if (cat.items && cat.items.some((item) => item.name === selectedNode.name)) {
          return cat.name;
        }
      }
    }
    return null;
  }, [hoveredNode, selectedNode, categories]);

  const glProps = useMemo(() => ({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
  }), []);

  return (
    <GalaxyInteractionContext.Provider value={ctxValue}>
      <div className="relative w-full h-full">
        <Canvas
          camera={{
            position: GALAXY.camera.position.toArray(),
            fov: GALAXY.camera.fov,
            near: GALAXY.camera.near,
            far: GALAXY.camera.far,
          }}
          dpr={[1, 1.5]}
          gl={glProps}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'auto',
          }}
        >
          <Suspense fallback={null}>
            <GalaxyScene categories={categories} entranceProgress={entranceProgress} />
            <AdaptiveDpr pixelated />
          </Suspense>
        </Canvas>
        <SkillTooltip categoryName={activeCategoryName} />
        <SkillDetailPanel categoryName={activeCategoryName} />
      </div>
    </GalaxyInteractionContext.Provider>
  );
});
