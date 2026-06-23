import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { getCategoryColor } from '../../utils/skillGalaxyConfig';

function drawIconOnCanvas(categoryName, color, glowColor) {
  const canvas = document.createElement('canvas');
  const size = 256;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  const drawOuterGlow = (drawFn) => {
    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 40;
    drawFn();
    ctx.restore();
    drawFn();
  };

  const prim = color;
  const sec = glowColor;

  switch (categoryName) {
    case 'Frontend': {
      drawOuterGlow(() => {
        ctx.strokeStyle = prim;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(cx - 25, cy, 60, -Math.PI * 0.35, Math.PI * 0.35);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + 25, cy, 60, Math.PI * 0.65, Math.PI * 1.35);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy - 5, 20, 0, Math.PI * 2);
        ctx.stroke();
      });
      break;
    }
    case 'Backend': {
      drawOuterGlow(() => {
        ctx.strokeStyle = prim;
        ctx.lineWidth = 5;
        const r = 50;
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
          const nextAngle = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2;
          ctx.beginPath();
          ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
          ctx.lineTo(cx + r * Math.cos(nextAngle), cy + r * Math.sin(nextAngle));
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.stroke();
      });
      break;
    }
    case 'Database': {
      drawOuterGlow(() => {
        ctx.strokeStyle = prim;
        ctx.lineWidth = 5;
        const bw = 60;
        const bh = 80;
        ctx.beginPath();
        ctx.ellipse(cx, cy - bh / 2, bw / 2, 16, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx, cy + bh / 2, bw / 2, 16, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - bw / 2, cy - bh / 2);
        ctx.lineTo(cx - bw / 2, cy + bh / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + bw / 2, cy - bh / 2);
        ctx.lineTo(cx + bw / 2, cy + bh / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx, cy, bw / 2, 16, 0, 0, Math.PI * 2);
        ctx.fillStyle = prim + '30';
        ctx.fill();
      });
      break;
    }
    case 'Programming': {
      drawOuterGlow(() => {
        ctx.strokeStyle = prim;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 55, cy - 15);
        ctx.lineTo(cx - 15, cy - 55);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 55, cy + 15);
        ctx.lineTo(cx - 15, cy + 55);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 15, cy - 55);
        ctx.lineTo(cx + 55, cy + 55);
        ctx.stroke();
      });
      break;
    }
    case 'Tools': {
      drawOuterGlow(() => {
        ctx.strokeStyle = prim;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(cx, cy - 10, 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy - 10 + 30);
        ctx.lineTo(cx - 8, cy + 50);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 8, cy - 10 + 30);
        ctx.lineTo(cx + 8, cy + 50);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 25, cy + 50);
        ctx.lineTo(cx + 25, cy + 50);
        ctx.stroke();
      });
      break;
    }
    default: {
      drawOuterGlow(() => {
        ctx.strokeStyle = prim;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(cx, cy, 40, 0, Math.PI * 2);
        ctx.stroke();
      });
    }
  }

  return canvas;
}

export const OrbitCenterIcon = React.memo(({ categoryName, orbitIndex }) => {
  const { isDarkMode } = useTheme();
  const spriteRef = useRef();
  const colorSet = getCategoryColor(categoryName);
  const prim = isDarkMode ? colorSet.primary : colorSet.secondary;
  const glow = colorSet.glow;

  const texture = useMemo(() => {
    const canvas = drawIconOnCanvas(categoryName, prim, glow);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [categoryName, prim, glow]);

  const size = 0.8;

  useFrame((state) => {
    if (!spriteRef.current) return;
    spriteRef.current.material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 0.5 + orbitIndex) * 0.15;
  });

  return (
    <sprite ref={spriteRef} scale={[size, size, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
});
