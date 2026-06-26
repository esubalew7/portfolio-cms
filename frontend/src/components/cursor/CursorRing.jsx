import { forwardRef } from 'react';
import { CURSOR } from '../../utils/cursorConfig';

export const CursorRing = forwardRef(({ colors }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9998,
        borderRadius: '50%',
        border: `${CURSOR.ring.borderWidth}px solid ${colors.color}`,
        boxShadow: `0 0 8px ${colors.glow}, inset 0 0 8px ${colors.glow}`,
        willChange: 'transform, width, height',
      }}
    />
  );
});

CursorRing.displayName = 'CursorRing';
