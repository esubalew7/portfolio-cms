import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useTheme } from '../../context/ThemeContext';
import { useTimelineProgress } from '../../hooks/useTimelineProgress';
import { TimelineLine } from './TimelineLine';
import { TimelineNode } from './TimelineNode';
import { TimelineConnector } from './TimelineConnector';
import { ExperienceCard } from './ExperienceCard';

const PRIMARY = '#2563eb';

export const ExperienceTimeline = React.memo(({ items }) => {
  const { isDarkMode } = useTheme();
  const { progressRef, sectionRef } = useTimelineProgress();
  const [visibleSet, setVisibleSet] = useState(new Set());
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      setProgress(progressRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [progressRef]);

  const handleVisibility = useCallback((index, isVisible) => {
    setVisibleSet((prev) => {
      const next = new Set(prev);
      if (isVisible) next.add(index);
      else next.delete(index);
      return next;
    });
  }, []);

  const activeIndex = useMemo(() => {
    if (visibleSet.size === 0) return -1;
    return Math.max(...Array.from(visibleSet));
  }, [visibleSet]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-20 lg:py-28 overflow-hidden"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundColor: isDarkMode
            ? 'rgba(30,58,95,0.04)'
            : 'rgba(191,219,254,0.04)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-3"
          >
            Experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto text-sm lg:text-base"
          >
            A timeline of my professional journey
          </motion.p>
        </div>

        <div className="relative">
          <TimelineLine progress={progress} />

          <div className="relative space-y-10 md:space-y-12 lg:space-y-16">
            {items.map((item, index) => {
              const side = index % 2 === 0 ? 'left' : 'right';
              return (
                <NodeRow
                  key={item._id || index}
                  item={item}
                  index={index}
                  side={side}
                  isActive={index === activeIndex}
                  onVisibilityChange={handleVisibility}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

const NodeRow = React.memo(({ item, index, side, isActive, onVisibilityChange }) => {
  const rowRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        onVisibilityChange(index, visible);
      },
      { threshold: 0.12, rootMargin: '-40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index, onVisibilityChange]);

  return (
    <div ref={rowRef} className="relative">
      {/* Mobile: 2-column (timeline|card) */}
      <div className="md:hidden grid grid-cols-[36px_1fr] gap-3 min-h-[160px]">
        <div className="relative flex flex-col items-center pt-6">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5"
            style={{ backgroundColor: isVisible ? PRIMARY : 'transparent', opacity: 0.2 }} />
          <TimelineNode item={item} index={index} isActive={isActive} isVisible={isVisible} />
        </div>
        <div className="pt-2 pb-4">
          <ExperienceCard item={item} isActive={isActive} isVisible={isVisible} />
        </div>
      </div>

      {/* Desktop: 3-column grid (card|node|card) */}
      <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-stretch min-h-[180px] lg:min-h-[200px]">
        {/* Left column */}
        <div className="relative flex items-center">
          {side === 'left' && (
            <div className="w-full flex items-center gap-1 lg:gap-2">
              <div className="flex-1 min-w-0">
                <ExperienceCard item={item} isActive={isActive} isVisible={isVisible} />
              </div>
              <div className="w-6 lg:w-10 shrink-0">
                <TimelineConnector isVisible={isVisible} />
              </div>
            </div>
          )}
        </div>

        {/* Center column */}
        <div className="relative flex items-center justify-center">
          <TimelineNode item={item} index={index} isActive={isActive} isVisible={isVisible} />
        </div>

        {/* Right column */}
        <div className="relative flex items-center">
          {side === 'right' && (
            <div className="w-full flex items-center gap-1 lg:gap-2 flex-row-reverse">
              <div className="flex-1 min-w-0">
                <ExperienceCard item={item} isActive={isActive} isVisible={isVisible} />
              </div>
              <div className="w-6 lg:w-10 shrink-0">
                <TimelineConnector isVisible={isVisible} origin="left" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
