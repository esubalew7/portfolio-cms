export const THEME_COLORS = {
  dark: {
    background: '#0a0a1a',
    particleColors: ['#3b82f6', '#8b5cf6', '#06b6d4'],
    glassTint: '#1e3a5f',
    textPrimary: '#ffffff',
    textSecondary: '#94a3b8',
    accent: '#60a5fa',
    wireframeColor: '#60a5fa',
    orbitLineColor: '#1e3a5f',
    emissiveColor: '#1e40af',
    logoGlass: '#2a4a7f',
  },
  light: {
    background: '#f8f9fa',
    particleColors: ['#3b82f6', '#818cf8', '#22d3ee'],
    glassTint: '#bfdbfe',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    accent: '#3b82f6',
    wireframeColor: '#3b82f6',
    orbitLineColor: '#e0e7ff',
    emissiveColor: '#bfdbfe',
    logoGlass: '#93c5fd',
  },
};

export const PARTICLE_CONFIG = {
  count: 2500,
  spread: 18,
  sizeRange: [0.015, 0.06],
  opacity: 0.5,
};

export const GEOMETRY_ELEMENTS = [
  { type: 'icosahedron', size: 0.45, position: [-3.5, 2, -2], speed: 0.25, wireframe: false },
  { type: 'torus', size: 0.35, position: [4, -1.8, -3], speed: 0.18, wireframe: false },
  { type: 'octahedron', size: 0.3, position: [2.5, -2.5, -3.5], speed: 0.35, wireframe: false },
  { type: 'sphere', size: 0.25, position: [-4.5, -0.5, -1.5], speed: 0.15, wireframe: false },
  { type: 'icosahedron', size: 0.2, position: [5, 2.5, -3.5], speed: 0.3, wireframe: true },
  { type: 'torus', size: 0.25, position: [-2, -2, -4], speed: 0.22, wireframe: true },
  { type: 'octahedron', size: 0.18, position: [0.5, 3, -4], speed: 0.4, wireframe: true },
];

export const TECH_ITEMS = [
  'React', 'Node.js', 'Express', 'MongoDB',
  'Cloudinary', 'JWT', 'Docker', 'Firebase', 'Socket.IO',
];

export const ORBIT = {
  minRadius: 5.5,
  maxRadius: 9,
  baseSpeed: 0.06,
  verticalSpread: 2.5,
};

export const CAMERA = {
  position: [0, 0, 10],
  fov: 45,
  near: 0.1,
  far: 50,
};

export const FONTS = {
  bold: 'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
  regular: 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
};
