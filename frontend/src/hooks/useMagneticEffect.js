import { useEffect, useRef, useCallback } from 'react';
import { CURSOR } from '../utils/cursorConfig';

export function useMagneticEffect(elementRef, options = {}) {
  const {
    radius = CURSOR.magnetic.radius,
    strength = CURSOR.magnetic.strength,
    lerpSpeed = CURSOR.magnetic.lerpSpeed,
    enabled = true,
  } = options;

  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const originRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);

  const animateRef = useRef(null);

  const getElementRect = useCallback(() => {
    const el = elementRef.current;
    if (!el) return null;
    return el.getBoundingClientRect();
  }, [elementRef]);

  animateRef.current = useCallback(() => {
    const el = elementRef.current;
    if (!el || !isHoveredRef.current) {
      currentRef.current.x += (0 - currentRef.current.x) * lerpSpeed;
      currentRef.current.y += (0 - currentRef.current.y) * lerpSpeed;
      if (Math.abs(currentRef.current.x) < 0.01 && Math.abs(currentRef.current.y) < 0.01) {
        currentRef.current.x = 0;
        currentRef.current.y = 0;
        if (el) {
          el.style.transform = `translate(0px, 0px)`;
        }
        return;
      }
      if (el) {
        el.style.transform = `translate(${currentRef.current.x.toFixed(2)}px, ${currentRef.current.y.toFixed(2)}px)`;
      }
      rafRef.current = requestAnimationFrame(animateRef.current);
      return;
    }

    const rect = getElementRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = mouseRef.current.x - centerX;
    const dy = mouseRef.current.y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < radius && dist > 0) {
      const force = (1 - dist / radius) * strength;
      const targetX = dx * force;
      const targetY = dy * force;
      currentRef.current.x += (targetX - currentRef.current.x) * lerpSpeed;
      currentRef.current.y += (targetY - currentRef.current.y) * lerpSpeed;
    } else {
      currentRef.current.x += (0 - currentRef.current.x) * lerpSpeed;
      currentRef.current.y += (0 - currentRef.current.y) * lerpSpeed;
    }

    if (el) {
      el.style.transform = `translate(${currentRef.current.x.toFixed(2)}px, ${currentRef.current.y.toFixed(2)}px)`;
      el.style.willChange = 'transform';
    }

    rafRef.current = requestAnimationFrame(animateRef.current);
  }, [elementRef, getElementRect, radius, strength, lerpSpeed]);

  useEffect(() => {
    if (!enabled) return;

    const el = elementRef.current;
    if (!el) return;

    originRef.current = { x: 0, y: 0 };
    currentRef.current = { x: 0, y: 0 };

    const onMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const onMouseEnter = () => {
      isHoveredRef.current = true;
      rafRef.current = requestAnimationFrame(animateRef.current);
    };

    const onMouseLeave = () => {
      isHoveredRef.current = false;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    el.addEventListener('mouseenter', onMouseEnter, { passive: true });
    el.addEventListener('mouseleave', onMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (el) {
        el.style.transform = '';
        el.style.willChange = '';
      }
    };
  }, [elementRef, enabled, animate]);
}
