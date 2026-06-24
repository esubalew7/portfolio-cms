import * as THREE from 'three';

export const GALAXY = {
  core: {
    radius: 0.8,
    segments: 64,
    material: {
      transmissionSampler: false,
      thickness: 0.3,
      roughness: 0.1,
      metalness: 0.05,
      ior: 1.5,
      chromaticAberration: 0.06,
      anisotropy: 0.3,
    },
  },
  orbits: {
    radii: [3.2, 4.8, 6.4, 8.0, 9.6],
    tilts: [0.12, -0.06, 0.18, -0.14, 0.08],
    speeds: [0.04, 0.028, 0.02, 0.014, 0.01],
    ringOpacity: 0.12,
    ringWidth: 1.5,
  },
  node: {
    coreRadius: 0.22,
    glowRadius: 0.55,
    hoverScale: 2.0,
    hoverElevation: 0.4,
  },
  connections: {
    lineOpacity: 0.12,
    lineWidth: 0.008,
    dashSize: 0.06,
    gapSize: 0.04,
    animateSpeed: 1.5,
  },
  particles: {
    count: 1500,
    spread: 10,
    sizeRange: [0.015, 0.05],
    opacity: 0.4,
  },
  camera: {
    position: new THREE.Vector3(8, 5, 14),
    fov: 40,
    near: 0.1,
    far: 40,
  },
  entrance: {
    nodeStaggerDelay: 0.15,
    orbitStaggerDelay: 0.2,
    coreDelay: 0.3,
    connectionDelay: 0.8,
    duration: 1.5,
  },
};

export const CATEGORY_COLORS = {
  Frontend: { primary: '#3b82f6', secondary: '#60a5fa', glow: '#93c5fd' },
  Backend: { primary: '#22c55e', secondary: '#4ade80', glow: '#86efac' },
  Database: { primary: '#a855f7', secondary: '#c084fc', glow: '#d8b4fe' },
  Programming: { primary: '#f97316', secondary: '#fb923c', glow: '#fdba74' },
  Tools: { primary: '#ef4444', secondary: '#f87171', glow: '#fca5a5' },
};

export const DEFAULT_COLOR = { primary: '#3b82f6', secondary: '#60a5fa', glow: '#93c5fd' };

export const RELATIONSHIPS = {
  React: ['Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'CSS3'],
  'Next.js': ['React', 'TypeScript', 'Tailwind CSS', 'Cloudinary'],
  TypeScript: ['React', 'Next.js', 'Node.js'],
  JavaScript: ['React', 'Node.js', 'TypeScript', 'HTML5'],
  HTML5: ['CSS3', 'JavaScript'],
  CSS3: ['Tailwind CSS', 'Bootstrap', 'HTML5'],
  'Tailwind CSS': ['React', 'Next.js', 'CSS3'],
  Bootstrap: ['CSS3', 'HTML5'],
  'Node.js': ['Express', 'MongoDB', 'Socket.IO', 'JavaScript'],
  Express: ['Node.js', 'MongoDB', 'REST API'],
  'Socket.IO': ['Node.js'],
  'REST API': ['Express', 'Node.js', 'Postman'],
  MongoDB: ['Node.js', 'Express', 'MySQL'],
  MySQL: ['MongoDB', 'PostgreSQL'],
  PostgreSQL: ['MySQL', 'MongoDB'],
  Java: ['C++', 'Python'],
  'C++': ['Java', 'Python'],
  Python: ['Java', 'Git'],
  Git: ['GitHub', 'VS Code'],
  GitHub: ['Git', 'Docker'],
  Docker: ['GitHub', 'Node.js'],
  Postman: ['REST API', 'Express'],
  'VS Code': ['Git', 'GitHub'],
  Cloudinary: ['Next.js', 'React'],
};

export function getCategoryColor(name) {
  return CATEGORY_COLORS[name] || DEFAULT_COLOR;
}

export function getCategoryIndex(categories, name) {
  return categories.findIndex((c) => c.name === name);
}
