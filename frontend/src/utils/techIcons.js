import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
const textureCache = new Map();
const canvasCache = new Map();

export function getSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

export const BRAND_COLORS = {
  HTML5: '#E34F26',
  CSS3: '#1572B6',
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  React: '#61DAFB',
  'Next.js': '#000000',
  TailwindCSS: '#06B6D4',
  Bootstrap: '#7952B3',
  'Node.js': '#339933',
  Express: '#000000',
  'Socket.IO': '#010101',
  'REST API': '#6366f1',
  MongoDB: '#47A248',
  MySQL: '#4479A1',
  PostgreSQL: '#4169E1',
  Java: '#ED8B00',
  'C++': '#00599C',
  Python: '#3776AB',
  Git: '#F05032',
  GitHub: '#181717',
  Docker: '#2496ED',
  Postman: '#FF6C37',
  'VS Code': '#007ACC',
  Cloudinary: '#3448C5',
};

export function preloadIconTexture(name) {
  const slug = getSlug(name);
  if (textureCache.has(slug)) return;
  const url = `https://cdn.simpleicons.org/${slug}/ffffff`;
  const texture = textureLoader.load(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(slug, texture);
}

export function getIconTexture(name) {
  const slug = getSlug(name);
  if (textureCache.has(slug)) {
    return textureCache.get(slug);
  }
  const url = `https://cdn.simpleicons.org/${slug}/ffffff`;
  const texture = textureLoader.load(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(slug, texture);
  return texture;
}

export function isTextureReady(name) {
  const slug = getSlug(name);
  const tex = textureCache.get(slug);
  if (!tex) return false;
  const img = tex.image;
  return img && img.complete && img.naturalWidth > 0;
}

export function createNodeCanvasTexture(categoryColor, brandColor, isDarkMode = true) {
  const key = `${categoryColor}-${brandColor}-${isDarkMode}`;
  if (canvasCache.has(key)) return canvasCache.get(key);

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const cx = 64;
  const cy = 64;
  const r = 50;

  ctx.clearRect(0, 0, 128, 128);

  if (isDarkMode) {
    const bgGrad = ctx.createRadialGradient(cx - 15, cy - 15, 5, cx, cy, r);
    bgGrad.addColorStop(0, categoryColor + '40');
    bgGrad.addColorStop(0.3, categoryColor + '25');
    bgGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.55)');
    bgGrad.addColorStop(1, 'rgba(15, 23, 42, 0.3)');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = categoryColor + '70';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    const bgGrad = ctx.createRadialGradient(cx - 15, cy - 15, 5, cx, cy, r);
    bgGrad.addColorStop(0, categoryColor + '30');
    bgGrad.addColorStop(0.3, 'rgba(30, 41, 59, 0.35)');
    bgGrad.addColorStop(0.7, 'rgba(30, 41, 59, 0.2)');
    bgGrad.addColorStop(1, 'rgba(30, 41, 59, 0.12)');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = categoryColor + '80';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  canvasCache.set(key, texture);
  return texture;
}
