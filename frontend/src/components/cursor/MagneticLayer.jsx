import React, { useRef, cloneElement } from 'react';
import { useMagneticEffect } from '../../hooks/useMagneticEffect';
import { CURSOR } from '../../utils/cursorConfig';

const MagneticElement = React.memo(
  ({ children, radius, strength, lerpSpeed, cursorState, cursorLabel, onStateChange }) => {
    const ref = useRef(null);

    useMagneticEffect(ref, {
      radius: radius ?? CURSOR.magnetic.radius,
      strength: strength ?? CURSOR.magnetic.strength,
      lerpSpeed: lerpSpeed ?? CURSOR.magnetic.lerpSpeed,
    });

    const handleMouseEnter = (e) => {
      if (cursorState && onStateChange) {
        onStateChange(cursorState, cursorLabel || '');
      }
      children.props.onMouseEnter?.(e);
    };

    const handleMouseLeave = (e) => {
      if (onStateChange) {
        onStateChange('default', '');
      }
      children.props.onMouseLeave?.(e);
    };

    const child = React.Children.only(children);

    return cloneElement(child, {
      ref,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      style: {
        ...child.props.style,
        transition: child.props.style?.transition || 'transform 0.1s ease-out',
      },
    });
  }
);

export const MagneticLayer = React.memo(
  ({
    children,
    radius,
    strength,
    lerpSpeed,
    cursorState: defaultState,
    cursorLabel: defaultLabel,
    cursorStateManager,
  }) => {
    const handleStateChange = cursorStateManager
      ? (state, label) => {
          if (state === 'default') {
            cursorStateManager.resetCursorState();
          } else {
            cursorStateManager.setCursorState(state, label);
          }
        }
      : undefined;

    return (
      <MagneticElement
        radius={radius}
        strength={strength}
        lerpSpeed={lerpSpeed}
        cursorState={defaultState}
        cursorLabel={defaultLabel}
        onStateChange={handleStateChange}
      >
        {children}
      </MagneticElement>
    );
  }
);

export function withMagnetic(Component, options = {}) {
  return React.memo(function MagneticWrapped(props) {
    return (
      <MagneticLayer {...options}>
        <Component {...props} />
      </MagneticLayer>
    );
  });
}
