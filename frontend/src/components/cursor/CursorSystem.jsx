import React, { useEffect, useCallback } from 'react';
import { CursorStateProvider, useCursorState } from '../../hooks/useCursorState';
import { useCursorEngine } from '../../hooks/useCursorEngine';
import { CursorCore } from './CursorCore';
import { CursorRing } from './CursorRing';
import { CursorLabel } from './CursorLabel';
import { ParticleTrail } from './ParticleTrail';
import { CursorGlow } from './CursorGlow';
import { CursorDepthLayer } from './CursorDepthLayer';
import { getInteractionState } from '../../utils/cursorInteractions';

function isTouchOrMobile() {
  const isTouch =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;
  return isTouch || isMobile || prefersReduced;
}

function CursorRenderer({ children }) {
  const cursorStateApi = useCursorState();
  const label = cursorStateApi.label;
  const { posRef, cursorState } = useCursorEngine();

  const handleMouseOver = useCallback(
    (e) => {
      const interaction = getInteractionState(e.target);
      if (interaction) {
        cursorStateApi.setCursorState(interaction.state, interaction.label);
      }
    },
    [cursorStateApi]
  );

  const handleMouseOut = useCallback(
    (e) => {
      const related = e.relatedTarget;
      if (!related || !related.closest) {
        cursorStateApi.resetCursorState();
        return;
      }
      const interaction = getInteractionState(e.target);
      const relatedInteraction = getInteractionState(related);
      if (interaction && (!relatedInteraction || relatedInteraction.state !== interaction.state)) {
        cursorStateApi.resetCursorState();
      }
    },
    [cursorStateApi]
  );

  useEffect(() => {
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [handleMouseOver, handleMouseOut]);

  return (
    <>
      <CursorDepthLayer posRef={posRef} />
      <CursorGlow posRef={posRef} />
      <ParticleTrail posRef={posRef} />
      <CursorRing posRef={posRef} state={cursorState} />
      <CursorCore posRef={posRef} state={cursorState} />
      <CursorLabel posRef={posRef} label={label} />
      {children}
    </>
  );
}

function CursorEnabled({ children }) {
  return (
    <CursorStateProvider onStateChange={() => {}}>
      <CursorRenderer>
        {children}
      </CursorRenderer>
    </CursorStateProvider>
  );
}

export function CursorSystem({ children }) {
  const [isEnabled, setIsEnabled] = React.useState(() => !isTouchOrMobile());

  useEffect(() => {
    if (isTouchOrMobile()) {
      setIsEnabled(false);
      return;
    }

    document.body.classList.add('cursor-hidden');

    const resizeHandler = () => {
      if (window.innerWidth < 768) {
        setIsEnabled(false);
        document.body.classList.remove('cursor-hidden');
      } else {
        setIsEnabled(true);
        document.body.classList.add('cursor-hidden');
      }
    };

    window.addEventListener('resize', resizeHandler, { passive: true });

    return () => {
      document.body.classList.remove('cursor-hidden');
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <CursorEnabled>
      {children}
    </CursorEnabled>
  );
}
