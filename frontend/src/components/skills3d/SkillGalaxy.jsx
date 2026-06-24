import React, { useState, useCallback, useMemo, useRef, Suspense, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import { GALAXY } from '../../utils/skillGalaxyConfig';
import { preloadIconTexture } from '../../utils/techIcons';
import { GalaxyInteractionContext } from '../../hooks/useSkillInteraction';
import { GalaxyBackground } from './GalaxyBackground';
import { GalaxyLighting } from './GalaxyLighting';
import { SkillCore } from './SkillCore';
import { SkillOrbit } from './SkillOrbit';
import { SkillConnections } from './SkillConnections';
import { SkillTooltip } from './SkillTooltip';
import { SkillDetailPanel } from './SkillDetailPanel';

function CameraController({ focusCategory, categories }) {
  const { camera } = useThree();
  const initialPos = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialPos.current.copy(camera.position);
      initialized.current = true;
    }
  }, [camera]);

  useFrame(() => {
    if (!focusCategory || !categories || categories.length === 0) {
      const target = initialPos.current.clone();
      camera.position.lerp(target, 0.03);
      camera.lookAt(0, 0, 0);
      return;
    }

    const catIndex = categories.findIndex((c) => c.name === focusCategory);
    if (catIndex < 0) return;

    const radii = GALAXY.orbits.radii;
    const radius = radii[catIndex % radii.length];
    const tilt = (GALAXY.orbits.tilts[catIndex % radii.length] || 0);

    const target = new THREE.Vector3(
      radius * 1.5,
      radius * 0.8 + Math.abs(tilt) * 2,
      radius * 2.5
    );

    camera.position.lerp(target, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function GalaxyScene({ categories, entranceProgress, focusCategory, onNodeHover }) {
  return (
    <>
      <GalaxyLighting />
      <GalaxyBackground />
      <CameraController focusCategory={focusCategory} categories={categories} />
      <SkillCore label="FULL STACK" />
      {categories.map((cat, i) => (
        <SkillOrbit
          key={cat.name}
          category={cat}
          orbitIndex={i}
          entranceProgress={entranceProgress}
          isFocused={focusCategory ? focusCategory === cat.name : undefined}
          onNodeHover={onNodeHover}
        />
      ))}
      <SkillConnections categories={categories} entranceProgress={entranceProgress} />
    </>
  );
}

export const SkillGalaxy = React.memo(({
  categories,
  entranceProgress,
  focusCategory,
}) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredScreenPos, setHoveredScreenPos] = useState({ x: 0, y: 0 });

  const clearHover = useCallback(() => setHoveredNode(null), []);
  const clearSelection = useCallback(() => setSelectedNode(null), []);

  useEffect(() => {
    if (categories) {
      for (const cat of categories) {
        for (const item of cat.items || []) {
          preloadIconTexture(item.name);
        }
      }
    }
  }, [categories]);

  const ctxValue = useMemo(() => ({
    hoveredNode,
    selectedNode,
    hoveredScreenPos,
    setHoveredNode,
    setSelectedNode,
    setHoveredScreenPos,
    clearHover,
    clearSelection,
  }), [hoveredNode, selectedNode, hoveredScreenPos, clearHover, clearSelection]);

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

  const cameraPos = useMemo(() => GALAXY.camera.position.toArray(), []);
  const cameraFov = GALAXY.camera.fov;

  return (
    <GalaxyInteractionContext.Provider value={ctxValue}>
      <div className="relative w-full h-full">
        <Canvas
          camera={{
            position: cameraPos,
            fov: cameraFov,
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
            <GalaxyScene
              categories={categories}
              entranceProgress={entranceProgress}
              focusCategory={focusCategory}
              onNodeHover={() => {}}
            />
            <AdaptiveDpr pixelated />
          </Suspense>
        </Canvas>
        <SkillTooltip categoryName={activeCategoryName} />
        <SkillDetailPanel categoryName={activeCategoryName} />
      </div>
    </GalaxyInteractionContext.Provider>
  );
});
