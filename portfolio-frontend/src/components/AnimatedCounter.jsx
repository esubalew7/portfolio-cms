import { useEffect, useState, useRef } from 'react';
import { animate, useInView } from 'framer-motion';

export const AnimatedCounter = ({ from = 0, to, duration = 2.5 }) => {
  const [value, setValue] = useState(from);
  const ref = useRef(null);
  // The counter will only trigger once it has entered the viewport completely
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(latestValue) {
          setValue(Math.round(latestValue));
        },
      });
      return () => controls.stop();
    }
  }, [from, to, duration, isInView]);

  return <span ref={ref}>{value}</span>;
};
