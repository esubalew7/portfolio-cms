import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import TestimonialCard from './TestimonialCard';

let instanceId = 0;

const PX_PER_SEC = 80;

const TestimonialsMarquee = ({ testimonials = [] }) => {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dur, setDur] = useState(30);

  const animName = useRef(`mq-${instanceId++}`);

  const items = useMemo(
    () => [...testimonials, ...testimonials, ...testimonials],
    [testimonials]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const w = el.scrollWidth / 3;
    setDur(Math.max(w / PX_PER_SEC, 1));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  if (!testimonials.length) return null;

  return (
    <>
      <style>{`@keyframes ${animName.current}{from{transform:translateX(0)}to{transform:translateX(-33.33333%)}}`}</style>
      <div
        ref={containerRef}
        className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={trackRef}
          className="flex gap-5 w-max will-change-transform"
          style={{
            animationName: animName.current,
            animationDuration: `${dur}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationPlayState: !visible || paused ? 'paused' : 'running',
          }}
        >
          {items.map((t, i) => (
            <TestimonialCard key={`${t.id || t._id || i}`} index={i} {...t} />
          ))}
        </div>
      </div>
    </>
  );
};

export default TestimonialsMarquee;
