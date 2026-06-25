import { memo } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const AVATAR_COLORS = [
  'from-blue-600 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-violet-500 to-purple-600',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
];

const getInitials = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

const TestimonialCard = memo(({ name, role, company, image, rating, feedback }, index) => {
  const colorIndex = (index || 0) % AVATAR_COLORS.length;
  const gradient = AVATAR_COLORS[colorIndex];

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="w-[280px] sm:w-[300px] lg:w-[340px] shrink-0 select-none"
    >
      <div className="h-full rounded-2xl border border-white/20 dark:border-white/10 bg-white/60 dark:bg-neutral-900/50 backdrop-blur-xl shadow-lg hover:shadow-xl dark:shadow-black/20 transition-shadow duration-300 p-5 flex flex-col gap-3.5">
        <div className="flex items-center gap-3.5">
          {image ? (
            <img loading="lazy"
              src={image}
              alt={name}
              loading="lazy"
              className="w-11 h-11 rounded-full object-cover ring-2 ring-white/50 dark:ring-white/10"
            />
          ) : (
            <div
              className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center ring-2 ring-white/50 dark:ring-white/10`}
            >
              <span className="text-white text-sm font-bold">{getInitials(name)}</span>
            </div>
          )}

          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
              {name}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {role}
              {company && (
                <>
                  {' '}
                  <span className="text-neutral-300 dark:text-neutral-600">·</span>{' '}
                  {company}
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-neutral-200 dark:fill-neutral-700 text-neutral-200 dark:text-neutral-700'
              }
            />
          ))}
        </div>

        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          <span className="text-blue-500 dark:text-blue-400 font-serif text-lg leading-none mr-0.5">
            &ldquo;
          </span>
          {feedback}
          <span className="text-blue-500 dark:text-blue-400 font-serif text-lg leading-none ml-0.5">
            &rdquo;
          </span>
        </p>
      </div>
    </motion.div>
  );
});

export default TestimonialCard;
