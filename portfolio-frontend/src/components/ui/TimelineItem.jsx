import React from 'react';
import { motion } from 'framer-motion';

const TimelineItem = ({
  logo,
  role,
  company,
  duration,
  location = '',
  tags = [],
  bullets = [],
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative w-full"
    >
      <div className="flex items-start gap-3 sm:gap-4 md:gap-6">
        <div className="flex flex-col items-center w-6 sm:w-8 md:w-10 flex-shrink-0">
          <span className="block w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-yellow-400 shadow-sm ring-4 ring-yellow-200/30" />
          <span className="hidden sm:block w-px h-full bg-neutral-200 dark:bg-neutral-800 mt-2" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-neutral-900/60 border border-neutral-200/40 dark:border-neutral-800/50 rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                {logo ? (
                  <img src={logo} alt={`${company} logo`} className="w-10 sm:w-12 h-10 sm:h-12 rounded-md object-cover shadow-sm shrink-0" />
                ) : (
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-md bg-yellow-400 flex items-center justify-center text-white font-semibold shrink-0">{company ? company[0] : '•'}</div>
                )}

                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-900 dark:text-white leading-snug">{role}</h3>
                  <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                    {company}
                    {location && (
                      <><span className="mx-1">·</span><span className="font-medium">{location}</span></>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 sm:text-right shrink-0">{duration}</div>
            </div>

            <div className="mt-3 sm:mt-4">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {tags.map((t) => (
                    <span key={t} className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-medium">{t}</span>
                  ))}
                </div>
              )}

              {bullets.length > 0 && (
                <ul className="mt-3 space-y-1.5 sm:space-y-1">
                  {bullets.map((b, i) => (
                    <li key={i} className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed pl-4 -indent-4">
                      <span className="inline-block w-1.5 mr-2 text-neutral-400 dark:text-neutral-500 shrink-0">•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineItem;
