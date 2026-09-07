import React from 'react';
import { motion } from 'framer-motion';
import { useTypewriter } from '../../hooks/useTypewriter';

const DEFAULT_TITLES = [
  'Full Stack Architect.',
  'System Design & Microservices.',
  'Production MERN Engineering.',
  'Real-Time Event Architectures.',
  'High-Performance Web Systems.',
];

export const EditorialHeadline = React.memo(({ hero }) => {
  // Use CMS titles if provided and non-empty, otherwise use senior architectural titles
  const rawTitles = hero?.titles && hero.titles.length > 0 ? hero.titles : DEFAULT_TITLES;
  
  // Transform any generic titles into authoritative senior positioning
  const titles = rawTitles.map(title => {
    if (/junior|beginner|passionate/i.test(title)) return 'Full Stack Architect.';
    if (/mern stack developer/i.test(title)) return 'Production MERN Architect.';
    return title;
  });

  const typedTitle = useTypewriter(titles, 75, 40, 2200);

  const greeting = hero?.greeting || 'Software Engineer & Architect';
  const name = hero?.name || 'Esubalew Molla';
  const description = hero?.description || 
    'Architecting resilient distributed systems, production-grade MERN platforms, and high-throughput real-time web applications with clean domain architecture and uncompromised performance.';

  return (
    <div className="space-y-6 lg:space-y-8 select-text">
      {/* Overline / Sub-discipline */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3"
      >
        <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
        <p className="text-caption text-accent font-semibold tracking-widest uppercase">
          {greeting}
        </p>
      </motion.div>

      {/* Monumental Name */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="text-display-xxl text-content-primary tracking-tightest leading-[1.02] font-extrabold"
      >
        {name}
      </motion.h1>

      {/* Dynamic Role Statement with Terminal-Sharp Precision */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="h-12 sm:h-14 lg:h-16 flex items-center"
      >
        <h2 className="text-card-heading sm:text-section-heading font-bold text-content-secondary tracking-tight flex items-baseline flex-wrap">
          <span className="mr-2.5 text-content-muted font-normal">Focused on</span>
          <span className="inline-block text-accent font-semibold border-r-2 border-accent pr-1.5 animate-pulse">
            {typedTitle}
          </span>
        </h2>
      </motion.div>

      {/* High-Impact Value Proposition */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="text-body-large text-content-secondary max-w-2xl leading-relaxed font-normal"
      >
        {description}
      </motion.p>
    </div>
  );
});

export default EditorialHeadline;
