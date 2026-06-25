import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const FULL_TEXT = 'ESUBALEW';

const letterVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const IntroLogo = ({ visibleChars, phase }) => {
  const { isDarkMode } = useTheme();

  const colors = useMemo(() => ({
    text: isDarkMode ? '#ffffff' : '#0f172a',
    glow: isDarkMode
      ? ['rgba(59,130,246,0.4)', 'rgba(139,92,246,0.2)']
      : ['rgba(59,130,246,0.15)', 'rgba(139,92,246,0.08)'],
    glass: isDarkMode
      ? 'rgba(255,255,255,0.03)'
      : 'rgba(255,255,255,0.6)',
    border: isDarkMode
      ? 'rgba(255,255,255,0.06)'
      : 'rgba(0,0,0,0.06)',
  }), [isDarkMode]);

  const showLogo = phase === 'logo' || phase === 'text';
  const isCollapsing = phase === 'collapse' || phase === 'done';

  return (
    <AnimatePresence>
      {showLogo && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          exit={{
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          <motion.div
            className="relative flex items-center justify-center"
            initial={false}
            animate={isCollapsing ? { scale: 0, opacity: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle at center, ${colors.glow[0]} 0%, ${colors.glow[1]} 50%, transparent 70%)`,
                filter: 'blur(40px)',
                transform: 'scale(1.4)',
              }}
            />

            <div
              className="relative px-8 py-6 rounded-2xl"
              style={{
                background: colors.glass,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${colors.border}`,
              }}
            >
              <div className="flex items-center justify-center gap-[2px]">
                {FULL_TEXT.split('').map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate={i < visibleChars ? 'visible' : 'hidden'}
                    className="font-bold tracking-[0.08em] select-none"
                    style={{
                      fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                      color: colors.text,
                      textShadow: isDarkMode
                        ? `0 0 30px ${colors.glow[0]}, 0 0 60px ${colors.glow[1]}`
                        : `0 0 20px ${colors.glow[0]}, 0 0 40px ${colors.glow[1]}`,
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
