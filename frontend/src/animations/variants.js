/**
 * ═══════════════════════════════════════════════════════════════════
 * EDITORIAL MOTION LANGUAGE (Framer Motion Presets)
 * Inspired by Apple, Framer & Stripe. High precision & tactile springs.
 * ═══════════════════════════════════════════════════════════════════
 */

// Global spring & ease calibrations
export const EASINGS = {
  editorial: [0.16, 1, 0.3, 1],       // Apple standard fluid deceleration
  snappy: [0.25, 1, 0.5, 1],          // Interactive elements
  smoothOut: [0.0, 0.0, 0.2, 1],      // Exit easing
};

export const SPRINGS = {
  subtle: { type: 'spring', stiffness: 260, damping: 28, mass: 0.8 },
  snappy: { type: 'spring', stiffness: 380, damping: 30, mass: 0.6 },
  gentle: { type: 'spring', stiffness: 180, damping: 24, mass: 1 },
};

/**
 * 1. Fade Variant
 * Subtle opacity reveal without excessive translation
 */
export const fade = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.5,
      delay,
      ease: EASINGS.editorial,
    },
  }),
  exit: {
    opacity: 0,
    transition: { duration: 0.25, ease: EASINGS.smoothOut },
  },
};

/**
 * Backward-compatible fadeIn with direction, delay, and duration
 */
export const fadeIn = (direction = 'up', delay = 0, duration = 0.6) => {
  const distance = 28; // Reduced distance for modern editorial feel (no huge 40px leaps)
  return {
    hidden: {
      y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
      x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
      opacity: 0,
    },
    visible: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 26,
        stiffness: 140,
        opacity: { duration: duration * 0.8, ease: EASINGS.editorial },
        duration,
        delay,
      },
    },
    exit: {
      opacity: 0,
      y: direction === 'up' ? -12 : 12,
      transition: { duration: 0.2, ease: EASINGS.smoothOut },
    },
  };
};

/**
 * 2. Slide Variant
 * Smooth directional entrance
 */
export const slideUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      ...SPRINGS.subtle,
      delay: custom.delay || 0,
      duration: custom.duration || 0.6,
    },
  }),
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.2, ease: EASINGS.smoothOut },
  },
};

export const slideIn = (direction = 'left', delay = 0) => ({
  hidden: {
    opacity: 0,
    x: direction === 'left' ? -32 : 32,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      ...SPRINGS.subtle,
      delay,
    },
  },
});

/**
 * 3. Scale Variant
 * Tactile reveal for cards, modal dialogs, and bento tiles
 */
export const scaleReveal = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      ...SPRINGS.subtle,
      delay,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.2 },
  },
};

/**
 * 4. Micro-Interaction Hover Presets
 * Crisp Apple/Stripe hover feedback
 */
export const cardHover = {
  rest: {
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: EASINGS.editorial },
  },
  hover: {
    y: -4,
    scale: 1.008,
    transition: { duration: 0.25, ease: EASINGS.editorial },
  },
  tap: {
    y: -1,
    scale: 0.995,
    transition: { duration: 0.1 },
  },
};

export const buttonHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.025,
    transition: { ...SPRINGS.snappy },
  },
  tap: {
    scale: 0.975,
    transition: { duration: 0.08 },
  },
};

/**
 * 5. Page Reveal Choreography
 * Orchestrates complete view transitions
 */
export const pageReveal = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: EASINGS.editorial,
      staggerChildren: 0.12,
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.25, ease: EASINGS.smoothOut },
  },
};

/**
 * 6. Stagger Container Variant
 */
export const staggerContainer = (staggerChildren = 0.12, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRINGS.subtle,
  },
};

/**
 * Helper to safely return reduced-motion compatible variants
 */
export const getReducedMotionSafe = (variant) => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } },
      exit: { opacity: 0, transition: { duration: 0.1 } },
    };
  }
  return variant;
};
