import React, { useRef, useMemo, useContext } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { GALAXY, getCategoryColor } from '../../utils/skillGalaxyConfig';
import { GalaxyInteractionContext } from '../../hooks/useSkillInteraction';

function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, 'rgba(255,255,255,0.6)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.15)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

const glowTexture = createGlowTexture();

export const SkillNode = React.memo(({
  position,
  skill,
  categoryName,
  index,
  total,
  orbitIndex,
  entranceProgress,
}) => {
  const { isDarkMode } = useTheme();
  const meshRef = useRef();
  const glowRef = useRef();
  const hoverScaleRef = useRef(1);
  const isHoveredRef = useRef(false);
  const { camera } = useThree();
  const worldPos = useRef(new THREE.Vector3());
  const screenPos = useRef(new THREE.Vector2());

  const ctx = useContext(GalaxyInteractionContext);

  const colorSet = getCategoryColor(categoryName);
  const color = new THREE.Color(isDarkMode ? colorSet.primary : colorSet.secondary);
  const glowColor = new THREE.Color(colorSet.glow);

  const level = skill.level || 70;
  const nodeScale = 0.5 + (level / 100) * 0.5;

  const delay = orbitIndex * 0.2 + index * 0.04;

  useFrame((state) => {
    if (!meshRef.current) return;

    const elapsed = state.clock.elapsedTime;
    const progress = Math.min(Math.max((elapsed - delay) * 0.8, 0), 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    if (entranceProgress !== undefined) {
      const combinedProgress = Math.min(eased * entranceProgress, 1);
      meshRef.current.scale.setScalar(combinedProgress * nodeScale * hoverScaleRef.current);
    } else {
      meshRef.current.scale.setScalar(nodeScale * hoverScaleRef.current);
    }

    if (glowRef.current) {
      const glowScale = nodeScale * (0.8 + Math.sin(elapsed * 1.5 + index) * 0.2) * hoverScaleRef.current;
      glowRef.current.scale.setScalar(glowScale);
      glowRef.current.material.opacity = (0.2 + Math.sin(elapsed * 1 + index * 0.5) * 0.08) * (isHoveredRef.current ? 0.6 : 1);
    }

    meshRef.current.getWorldPosition(worldPos.current);
    worldPos.current.project(camera);
    screenPos.current.x = (worldPos.current.x * 0.5 + 0.5) * window.innerWidth;
    screenPos.current.y = (-worldPos.current.y * 0.5 + 0.5) * window.innerHeight;
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    isHoveredRef.current = true;
    hoverScaleRef.current = GALAXY.node.hoverScale;
    document.body.style.cursor = 'pointer';
    ctx.setHoveredNode(skill);
    ctx.setHoveredScreenPos({ x: screenPos.current.x, y: screenPos.current.y });
  };

  const handlePointerMove = (e) => {
    if (isHoveredRef.current) {
      ctx.setHoveredScreenPos({ x: screenPos.current.x, y: screenPos.current.y });
    }
  };

  const handlePointerOut = () => {
    isHoveredRef.current = false;
    hoverScaleRef.current = 1;
    document.body.style.cursor = 'default';
    ctx.clearHover();
  };

  const handleClick = (e) => {
    e.stopPropagation();
    ctx.setSelectedNode(skill);
  };

  return (
    <group position={position}>
      <mesh
        ref={glowRef}
        position={[0, 0, 0]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glowTexture}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          color={glowColor}
        />
      </mesh>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        scale={[nodeScale, nodeScale, nodeScale]}
      >
        <sphereGeometry args={[GALAXY.node.coreRadius, 16, 16]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isDarkMode ? 0.8 : 0.3}
          metalness={0.3}
          roughness={0.2}
          clearcoat={0.4}
          clearcoatRoughness={0.3}
          envMapIntensity={1.0}
        />
      </mesh>
    </group>
  );
});
