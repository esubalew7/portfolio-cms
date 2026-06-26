export const CURSOR = {
  core: {
    restSize: 10,
    dark: { color: '#3b82f6', glow: 'rgba(59,130,246,0.5)' },
    light: { color: '#6b7280', glow: 'rgba(107,114,128,0.3)' },
  },
  ring: {
    restSize: 24,
    borderWidth: 1,
    dark: { color: 'rgba(96,165,250,0.2)', glow: 'rgba(96,165,250,0.06)' },
    light: { color: 'rgba(107,114,128,0.15)', glow: 'rgba(107,114,128,0.04)' },
  },
  magnetic: {
    radius: 120,
    strength: 0.15,
    lerpSpeed: 0.15,
  },
  physics: {
    positionLerp: 0.9,
    scaleLerp: 0.15,
    ringScaleLerp: 0.12,
  },
  interactionScale: {
    default: { scale: 1, ringScale: 1 },
    hover: { scale: 1.2, ringScale: 1.5 },
    click: { scale: 0.9, ringScale: 1.3 },
  },
};
