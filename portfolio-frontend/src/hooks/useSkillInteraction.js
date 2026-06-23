import { createContext, useContext } from 'react';

export const GalaxyInteractionContext = createContext({
  hoveredNode: null,
  selectedNode: null,
  hoveredScreenPos: { x: 0, y: 0 },
  setHoveredNode: () => {},
  setSelectedNode: () => {},
  setHoveredScreenPos: () => {},
  clearHover: () => {},
  clearSelection: () => {},
});

export function useGalaxyInteraction() {
  const ctx = useContext(GalaxyInteractionContext);
  if (!ctx) {
    throw new Error(
      'useGalaxyInteraction must be used within GalaxyInteractionProvider'
    );
  }
  return ctx;
}
