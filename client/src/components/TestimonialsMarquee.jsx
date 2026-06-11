import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import TestimonialCard from './TestimonialCard';

const SPEED = 3; // Adjust this value to make the marquee faster or slower

const TestimonialsMarquee = ({ testimonials = [] }) => {
  const x = useMotionValue(0);
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const marqueeWidthRef = useRef(0);
  const isPausedRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const measure = useCallback(() => {
    if (trackRef.current) {
      marqueeWidthRef.current = trackRef.current.scrollWidth / 2;
    }
  }, []);

  useEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const handleResize = () => measure();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measure]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((delta) => {
    if (!isVisible || isPausedRef.current) return;
    const mw = marqueeWidthRef.current;
    if (!mw) return;

    const step = (SPEED * delta) / 100000;
    let newX = x.get() - step; // - step used to make it scroll from right to left, use + step for left to right

    if (Math.abs(newX) >= mw) {
      newX += mw;
    }

    x.set(newX);
  });

  if (!testimonials.length) return null;

  const allItems = [...testimonials, ...testimonials];

  return (
    <div
      ref={containerRef}
      className="overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        ref={trackRef}
        style={{ x }}
        className="flex gap-5 w-max will-change-transform"
      >
        {allItems.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} {...t} />
        ))}
      </motion.div>
    </div>
  );
};

export default TestimonialsMarquee;
