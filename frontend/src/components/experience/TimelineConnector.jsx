import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const PRIMARY = '#2563eb';

export const TimelineConnector = React.memo(({ isVisible, origin = 'left' }) => {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={`h-px flex-1 ${origin === 'left' ? 'origin-left' : 'origin-right'}`}
      style={{
        backgroundColor: PRIMARY,
        opacity: 0.3,
      }}
    />
  );
});
