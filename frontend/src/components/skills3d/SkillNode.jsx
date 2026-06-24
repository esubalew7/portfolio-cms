import React, { useRef, useMemo, useContext, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { GALAXY, getCategoryColor } from '../../utils/skillGalaxyConfig';
import { GalaxyInteractionContext } from '../../hooks/useSkillInteraction';
import { getIconTexture, createNodeCanvasTexture, BRAND_COLORS, isTextureReady } from '../../utils/techIcons';

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
  orbitIndex,
  entranceProgress,
  isFocused,
  onHoverChange,
}) => {
  const { isDarkMode } = useTheme();
  const meshRef = useRef();
  const glowRef = useRef();
  const badgeRef = useRef();
  const ringRef = useRef();
  const iconSpriteRef = useRef();
  const hoverScaleRef = useRef(1);
  const isHoveredRef = useRef(false);
  const [iconLoaded, setIconLoaded] = useState(false);
  const { camera } = useThree();
  const worldPos = useRef(new THREE.Vector3());
  const screenPos = useRef(new THREE.Vector2());

  const ctx = useContext(GalaxyInteractionContext);

  const colorSet = getCategoryColor(categoryName);
  const primaryColor = isDarkMode ? colorSet.primary : colorSet.secondary;
  const glowColor = new THREE.Color(colorSet.glow);
  const brandColor = BRAND_COLORS[skill.name] || primaryColor;

  const level = skill.level || 70;
  const nodeScale = 0.5 + (level / 100) * 0.5;
  const badgeScale = 0.6 + (level / 100) * 0.4;

  const delay = orbitIndex * 0.2 + index * 0.04;

  const glassTexture = useMemo(() => {
    return createNodeCanvasTexture(primaryColor, brandColor);
  }, [primaryColor, brandColor]);

  const iconTexture = useMemo(() => getIconTexture(skill.name), [skill.name]);

  useEffect(() => {
    if (isTextureReady(skill.name)) {
      setIconLoaded(true);
      return;
    }
    const check = setInterval(() => {
      if (isTextureReady(skill.name)) {
        setIconLoaded(true);
        clearInterval(check);
      }
    }, 50);
    return () => clearInterval(check);
  }, [skill.name, iconTexture]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const elapsed = state.clock.elapsedTime;
    const progress = Math.min(Math.max((elapsed - delay) * 0.8, 0), 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    let combinedProgress;
    if (entranceProgress !== undefined) {
      combinedProgress = Math.min(eased * entranceProgress, 1);
    } else {
      combinedProgress = 1;
    }

    const currentScale = nodeScale * hoverScaleRef.current * combinedProgress;
    meshRef.current.scale.setScalar(currentScale);

    if (glowRef.current) {
      const glowScale = nodeScale * (1.2 + Math.sin(elapsed * 1.5 + index) * 0.25) * hoverScaleRef.current * combinedProgress;
      glowRef.current.scale.setScalar(glowScale);
      glowRef.current.material.opacity = (0.2 + Math.sin(elapsed * 1 + index * 0.5) * 0.08) * (isHoveredRef.current ? 0.8 : 1);
    }

    if (badgeRef.current) {
      const badgeS = badgeScale * hoverScaleRef.current * combinedProgress;
      badgeRef.current.scale.setScalar(badgeS);
      badgeRef.current.material.opacity = 0.85 * (isHoveredRef.current ? 1 : 0.85);
    }

    if (ringRef.current) {
      const ringS = badgeScale * 1.05 * hoverScaleRef.current * combinedProgress;
      ringRef.current.scale.setScalar(ringS);
      ringRef.current.material.opacity = (0.5 + Math.sin(elapsed * 2 + index) * 0.15) * (isHoveredRef.current ? 0.9 : 0.5);
    }

    if (iconSpriteRef.current && iconLoaded) {
      const iconS = badgeScale * 0.55 * hoverScaleRef.current * combinedProgress;
      iconSpriteRef.current.scale.setScalar(iconS);
      iconSpriteRef.current.material.opacity = (0.7 + Math.sin(elapsed * 1.2 + index) * 0.1) * (isHoveredRef.current ? 1 : 0.7);
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
    if (onHoverChange) onHoverChange(true);
  };

  const handlePointerMove = () => {
    if (isHoveredRef.current) {
      ctx.setHoveredScreenPos({ x: screenPos.current.x, y: screenPos.current.y });
    }
  };

  const handlePointerOut = () => {
    isHoveredRef.current = false;
    hoverScaleRef.current = 1;
    document.body.style.cursor = 'default';
    ctx.clearHover();
    if (onHoverChange) onHoverChange(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    ctx.setSelectedNode(skill);
  };

  const opacity = isFocused !== undefined ? (isFocused ? 1 : 0.2) : 1;

  return (
    <group position={position}>
      <sprite
        ref={glowRef}
        position={[0, 0, -0.05]}
        scale={[0.8, 0.8, 1]}
      >
        <spriteMaterial
          map={glowTexture}
          transparent
          opacity={0.2 * opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          color={glowColor}
        />
      </sprite>

      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        scale={[nodeScale, nodeScale, nodeScale]}
      >
        <sphereGeometry args={[GALAXY.node.coreRadius, 20, 20]} />
        <meshPhysicalMaterial
          color={new THREE.Color(isDarkMode ? colorSet.primary : colorSet.secondary)}
          emissive={new THREE.Color(colorSet.glow)}
          emissiveIntensity={isDarkMode ? 0.4 : 0.15}
          metalness={0.1}
          roughness={0.3}
          transparent
          opacity={0.6 * opacity}
          clearcoat={0.2}
          envMapIntensity={0.5}
        />
      </mesh>

      <sprite
        ref={badgeRef}
        position={[0, 0, 0.02]}
        scale={[badgeScale, badgeScale, 1]}
      >
        <spriteMaterial
          map={glassTexture}
          transparent
          opacity={0.85 * opacity}
          depthWrite={false}
        />
      </sprite>

      <sprite
        ref={ringRef}
        position={[0, 0, 0.01]}
        scale={[badgeScale * 1.05, badgeScale * 1.05, 1]}
      >
        <spriteMaterial
          map={glassTexture}
          transparent
          opacity={0.5 * opacity}
          depthWrite={false}
        />
      </sprite>

      {iconLoaded && iconTexture && (
        <sprite
          ref={iconSpriteRef}
          position={[0, 0, 0.06]}
          scale={[badgeScale * 0.55, badgeScale * 0.55, 1]}
        >
          <spriteMaterial
            map={iconTexture}
            transparent
            opacity={0.85 * opacity}
            depthWrite={false}
          />
        </sprite>
      )}
    </group>
  );
});
