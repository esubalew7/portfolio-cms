import React from 'react';
import { motion } from 'framer-motion';

export const AvailabilityBadge = React.memo(({ statusText = "Available for Engineering Roles & Systems Consulting" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-raised border border-border-subtle shadow-soft transition-colors duration-200 select-none group"
      role="status"
      aria-label={statusText}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
      </span>
      <span className="text-caption text-content-secondary tracking-widest font-semibold uppercase">
        {statusText}
      </span>
    </motion.div>
  );
});

export default AvailabilityBadge;
