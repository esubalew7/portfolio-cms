import { useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

// Snappier dot spring for near-instant tracking; ring trails slightly behind but much quicker than before
const SPRING_CONFIG_DOT = { stiffness: 1800, damping: 30, mass: 0.12 };
const SPRING_CONFIG_RING = { stiffness: 600, damping: 28, mass: 0.28 };

// Variant definitions for the outer ring
const ringVariants = {
  default: {
    width: 36,
    height: 36,
    borderColor: 'rgba(255, 214, 10, 0.95)',
    backgroundColor: 'transparent',
    scale: 1,
    opacity: 1,
  },
  hover: {
    width: 52,
    height: 52,
    borderColor: 'rgba(255, 214, 10, 0.9)',
    backgroundColor: 'rgba(255, 214, 10, 0.08)',
    scale: 1,
    opacity: 1,
  },
  button: {
    width: 60,
    height: 60,
    borderColor: 'rgba(255, 184, 0, 0.95)',
    backgroundColor: 'rgba(255, 184, 0, 0.12)',
    scale: 1,
    opacity: 1,
  },
  link: {
    width: 48,
    height: 48,
    borderColor: 'rgba(255, 214, 10, 0.9)',
    backgroundColor: 'rgba(255, 214, 10, 0.06)',
    scale: 1,
    opacity: 1,
  },
  card: {
    width: 72,
    height: 72,
    borderColor: 'rgba(255, 214, 10, 0.65)',
    backgroundColor: 'rgba(255, 214, 10, 0.04)',
    scale: 1,
    opacity: 1,
  },
  text: {
    width: 80,
    height: 80,
    borderColor: 'rgba(255, 214, 10, 0.7)',
    backgroundColor: 'rgba(255, 214, 10, 0.06)',
    scale: 1,
    opacity: 1,
  },
};

// Variant definitions for the inner dot
const dotVariants = {
  default: {
    width: 8,
    height: 8,
    backgroundColor: 'rgba(255, 214, 10, 0.95)',
    scale: 1,
  },
  hover: {
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 214, 10, 1)',
    scale: 1,
  },
  button: {
    width: 4,
    height: 4,
    backgroundColor: 'rgba(255, 184, 0, 1)',
    scale: 0.5,
  },
  link: {
    width: 5,
    height: 5,
    backgroundColor: 'rgba(255, 214, 10, 1)',
    scale: 1,
  },
  card: {
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 214, 10, 0.9)',
    scale: 1,
  },
  text: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    scale: 0,
  },
};

const INTERACTIVE_SELECTORS = 'a, button, [role="button"], input, textarea, select, [data-cursor]';

function getVariantFromElement(el) {
  if (!el) return null;
  // Explicit override via data attribute
  const explicit = el.closest('[data-cursor]');
  if (explicit) return explicit.getAttribute('data-cursor');
  // Cards / card-like containers
  if (el.closest('[data-cursor-card], .card, [class*="card"]')) return 'card';
  // Buttons
  if (el.closest('button, [role="button"], input[type="submit"], input[type="button"]')) return 'button';
  // Links
  if (el.closest('a')) return 'link';
  // Inputs
  if (el.closest('input, textarea, select')) return 'text';
  return null;
}

export const CustomCursor = () => {
  const { cursorVariant, setCursorVariant, cursorText, setCursorText } = useCursor();
  const isTouchDevice = useRef(false);
  const isVisible = useRef(false);
  const visibilityRef = useRef(null);

  // Raw mouse coordinates → spring-smoothed for each element
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const dotX = useSpring(mouseX, SPRING_CONFIG_DOT);
  const dotY = useSpring(mouseY, SPRING_CONFIG_DOT);
  const ringX = useSpring(mouseX, SPRING_CONFIG_RING);
  const ringY = useSpring(mouseY, SPRING_CONFIG_RING);

  // Detect touch device once on mount
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    isTouchDevice.current = mq.matches;

    const handler = (e) => { isTouchDevice.current = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Mouse move listener — raw, no React state
  const onMouseMove = useCallback((e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);

    if (!isVisible.current && visibilityRef.current) {
      visibilityRef.current.style.opacity = '1';
      isVisible.current = true;
    }
  }, [mouseX, mouseY]);

  // Mouse leave / enter window
  const onMouseLeave = useCallback(() => {
    if (visibilityRef.current) {
      visibilityRef.current.style.opacity = '0';
      isVisible.current = false;
    }
  }, []);

  const onMouseEnter = useCallback((e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    if (visibilityRef.current) {
      visibilityRef.current.style.opacity = '1';
      isVisible.current = true;
    }
  }, [mouseX, mouseY]);

  // Delegated hover detection — single listener on document
  const onMouseOver = useCallback((e) => {
    const target = e.target;
    const variant = getVariantFromElement(target);

    if (variant) {
      setCursorVariant(variant);
      // Check for cursor text override
      const textEl = target.closest('[data-cursor-text]');
      if (textEl) setCursorText(textEl.getAttribute('data-cursor-text'));
    } else {
      setCursorVariant('default');
      setCursorText('');
    }
  }, [setCursorVariant, setCursorText]);

  useEffect(() => {
    if (isTouchDevice.current) return;

    // Use pointer events for snappier cross-device tracking on desktops
    document.addEventListener('pointermove', onMouseMove, { passive: true });
    document.addEventListener('pointerleave', onMouseLeave);
    document.addEventListener('pointerenter', onMouseEnter);
    document.addEventListener('pointerover', onMouseOver, { passive: true });

    return () => {
      document.removeEventListener('pointermove', onMouseMove);
      document.removeEventListener('pointerleave', onMouseLeave);
      document.removeEventListener('pointerenter', onMouseEnter);
      document.removeEventListener('pointerover', onMouseOver);
    };
  }, [onMouseMove, onMouseLeave, onMouseEnter, onMouseOver]);

  // Don't render anything on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  const currentRing = ringVariants[cursorVariant] || ringVariants.default;
  const currentDot = dotVariants[cursorVariant] || dotVariants.default;

  return (
    <div
      ref={visibilityRef}
      className="pointer-events-none fixed inset-0 z-[9999] opacity-0 transition-opacity duration-300"
      style={{ mixBlendMode: 'normal' }}
    >
      {/* Outer trailing ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border pointer-events-none"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        animate={{
          width: currentRing.width,
          height: currentRing.height,
          borderColor: currentRing.borderColor,
          backgroundColor: currentRing.backgroundColor,
          scale: currentRing.scale,
          opacity: currentRing.opacity,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
          mass: 0.3,
        }}
      >
        {/* Soft glow layer */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: cursorVariant !== 'default'
              ? '0 0 20px 4px rgba(255, 214, 10, 0.18), 0 0 40px 8px rgba(255, 214, 10, 0.08)'
              : '0 0 0px 0px transparent',
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        animate={{
          width: currentDot.width,
          height: currentDot.height,
          backgroundColor: currentDot.backgroundColor,
          scale: currentDot.scale,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 28,
          mass: 0.2,
        }}
      />

      {/* Cursor text label */}
      <AnimatePresence>
        {cursorText && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none flex items-center justify-center"
            style={{
              x: ringX,
              y: ringY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-[11px] font-semibold text-white tracking-widest uppercase whitespace-nowrap">
              {cursorText}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
