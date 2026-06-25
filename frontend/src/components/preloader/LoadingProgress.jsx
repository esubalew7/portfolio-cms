import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const roles = [
  'Full Stack Developer',
  'MERN Stack Engineer',
  'Problem Solver',
];

const roleVariants = {
  enter: { opacity: 0, y: 20, filter: 'blur(4px)' },
  center: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(4px)',
    transition: { duration: 0.4, ease: 'easeIn' },
  },
};

export const LoadingProgress = ({ progress, loadingMessage, phase }) => {
  const { isDarkMode } = useTheme();
  const show = phase === 'progress' || phase === 'collapse' || phase === 'done';

  const currentRoleIndex = useMemo(() => {
    if (progress < 30) return 0;
    if (progress < 65) return 1;
    return 2;
  }, [progress]);

  const colors = useMemo(() => ({
    text: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
    accent: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)',
    track: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    fill: isDarkMode ? '#3b82f6' : '#3b82f6',
    sub: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
  }), [isDarkMode]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-16 sm:pb-20 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col items-center gap-3 mb-8">
            <AnimatePresence mode="popLayout">
              <motion.p
                key={currentRoleIndex}
                custom={currentRoleIndex}
                variants={roleVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="font-medium tracking-wide text-center select-none"
                style={{
                  fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
                  color: colors.accent,
                }}
              >
                {roles[currentRoleIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <p
            className="text-sm tracking-wider uppercase select-none mb-4"
            style={{ color: colors.sub, letterSpacing: '0.15em' }}
          >
            {loadingMessage}
          </p>

          <div
            className="relative w-48 sm:w-64 h-[2px] overflow-hidden rounded-full"
            style={{ background: colors.track }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: colors.fill }}
              animate={{
                width: `${progress}%`,
                boxShadow: isDarkMode
                  ? `0 0 8px ${colors.fill}40`
                  : 'none',
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          <p
            className="mt-3 text-xs font-mono tabular-nums select-none"
            style={{ color: colors.sub }}
          >
            {Math.round(progress)}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
