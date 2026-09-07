import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

function MagneticButton({ children, href, className = '', ...props }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Soft tactile spring configuration
  const springConfig = { damping: 18, stiffness: 220, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.28; // Subtle magnetic draw
    const distanceY = (e.clientY - centerY) * 0.28;
    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.98 }}
      className={`relative inline-flex items-center justify-center font-medium text-sm transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent/50 cursor-pointer select-none ${className}`}
      {...props}
    >
      {children}
    </motion.a>
  );
}

export const HeroCTA = React.memo(({ cta, resumeUrl = '/resume.pdf' }) => {
  const primaryText = cta?.primary?.text || 'View Featured Projects';
  const primaryLink = cta?.primary?.link || '#projects';
  const secondaryText = cta?.secondary?.text || 'Download Resume';
  const secondaryLink = resumeUrl || cta?.secondary?.link || '/resume.pdf';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto"
    >
      {/* Magnetic Primary Action */}
      <MagneticButton
        href={primaryLink}
        className="px-7 py-3.5 rounded-md bg-accent text-accent-foreground shadow-soft hover:bg-accent-hover hover:shadow-medium group overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2.5 font-semibold tracking-tight">
          {primaryText}
          <svg
            className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </span>
        {/* Specular sheen flash on hover */}
        <span
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          aria-hidden="true"
        />
      </MagneticButton>

      {/* Refined Secondary Action */}
      <motion.a
        href={secondaryLink}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="px-7 py-3.5 rounded-md bg-surface-base text-content-primary border border-border shadow-soft hover:border-border-strong hover:bg-surface-raised transition-all duration-200 text-center font-medium text-sm flex items-center justify-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-accent/50 cursor-pointer group"
      >
        <span>{secondaryText}</span>
        <svg
          className="w-4 h-4 text-content-muted transition-colors duration-200 group-hover:text-content-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      </motion.a>
    </motion.div>
  );
});

export default HeroCTA;
