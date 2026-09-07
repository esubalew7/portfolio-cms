import React from 'react';
import { motion } from 'framer-motion';

const METRIC_PILLARS = [
  {
    tag: 'ARCHITECTURE',
    title: 'Distributed MERN',
    detail: 'Modular event-driven systems with clean separation of concerns',
  },
  {
    tag: 'PERFORMANCE',
    title: 'Sub-Second Latency',
    detail: 'Optimized rendering, caching pipelines & WebGL acceleration',
  },
  {
    tag: 'RELIABILITY',
    title: 'Production-Hardened',
    detail: 'TOTP 2FA, HttpOnly security, real-time WebSocket sync',
  },
];

export const FloatingMetrics = React.memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border-subtle/80 max-w-2xl"
    >
      {METRIC_PILLARS.map((item, idx) => (
        <div
          key={idx}
          className="p-3.5 rounded-md bg-surface-base/60 border border-border-subtle/80 transition-all duration-300 hover:border-border hover:bg-surface-base group"
        >
          <div className="text-[10px] font-semibold text-accent tracking-widest uppercase mb-1 font-code">
            {item.tag}
          </div>
          <div className="text-sm font-semibold text-content-primary mb-1 tracking-tight">
            {item.title}
          </div>
          <div className="text-xs text-content-muted leading-relaxed">
            {item.detail}
          </div>
        </div>
      ))}
    </motion.div>
  );
});

export default FloatingMetrics;
