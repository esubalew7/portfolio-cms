import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useTheme } from '../../context/ThemeContext';

const VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const ExperienceCard = React.memo(({ item, isActive, isVisible }) => {
  const { isDarkMode } = useTheme();
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateZ(6px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  }, []);

  return (
    <motion.div
      ref={cardRef}
      variants={VARIANTS}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full rounded-xl p-5 transition-all duration-300 select-none"
      style={{
        background: isDarkMode
          ? 'rgba(15,23,42,0.7)'
          : 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: isDarkMode
          ? '1px solid rgba(37,99,235,0.12)'
          : '1px solid rgba(37,99,235,0.08)',
        boxShadow: isDarkMode
          ? `0 4px 24px rgba(0,0,0,0.15)${isActive ? ', 0 0 24px rgba(37,99,235,0.12)' : ''}`
          : `0 4px 24px rgba(0,0,0,0.04)${isActive ? ', 0 0 24px rgba(37,99,235,0.08)' : ''}`,
        transformStyle: 'preserve-3d',
        scale: isActive ? 1.02 : 1,
        opacity: isVisible ? 1 : 0.35,
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        {item.logo && (
          <img
            src={item.logo}
            alt={item.company || ''}
            className="w-10 h-10 rounded-lg object-cover shrink-0"
            loading="lazy"
          />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-base lg:text-lg font-semibold text-neutral-900 dark:text-white leading-snug">
            {item.position || item.role}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {item.company || item.organization}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500 mb-3">
        <span>{item.duration}</span>
        {item.location && (
          <>
            <span>·</span>
            <span>{item.location}</span>
          </>
        )}
      </div>

      {item.description && (
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
          {item.description}
        </p>
      )}

      {item.bullets && item.bullets.length > 0 && (
        <ul className="space-y-1 mb-3">
          {item.bullets.map((b, i) => (
            <li
              key={i}
              className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed pl-4 -indent-4"
            >
              <span className="inline-block w-1.5 mr-2 shrink-0" style={{ color: '#2563eb' }}>•</span>
              {b}
            </li>
          ))}
        </ul>
      )}

      {item.technologies && item.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.technologies.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: isDarkMode
                  ? 'rgba(37,99,235,0.12)'
                  : 'rgba(37,99,235,0.06)',
                color: '#2563eb',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
});
