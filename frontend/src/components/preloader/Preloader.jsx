import { useMemo, lazy, Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { usePortfolioLoading } from '../../hooks/usePortfolioLoading';
import { IntroLogo } from './IntroLogo';
import { LoadingProgress } from './LoadingProgress';

const NeuralNetwork = lazy(() =>
  import('./NeuralNetwork').then((m) => ({ default: m.NeuralNetwork }))
);

export const Preloader = ({ onComplete }) => {
  const { isDarkMode } = useTheme();
  const { phase, progress, visibleChars, isComplete, loadingMessage } = usePortfolioLoading();
  const [flashActive, setFlashActive] = useState(false);

  useEffect(() => {
    if (phase === 'collapse') {
      setFlashActive(true);
      const t = setTimeout(() => setFlashActive(false), 600);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (isComplete && onComplete) {
      const t = setTimeout(() => onComplete(), 200);
      return () => clearTimeout(t);
    }
  }, [isComplete, onComplete]);

  const showNeural = phase === 'neural' || phase === 'progress' || phase === 'collapse';

  const bgStyles = useMemo(() => {
    if (phase === 'collapse' || phase === 'done') {
      return { opacity: 0, transition: 'opacity 0.5s ease' };
    }
    return {};
  }, [phase]);

  const containerClass = useMemo(() => {
    if (phase === 'done') return 'opacity-0 pointer-events-none';
    return '';
  }, [phase]);

  return (
    <motion.div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden ${containerClass}`}
      style={{
        background: isDarkMode
          ? 'radial-gradient(ellipse at center, #0f172a 0%, #0a0a1a 100%)'
          : 'radial-gradient(ellipse at center, #ffffff 0%, #f8f9fa 100%)',
        ...bgStyles,
      }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: isDarkMode
            ? 'radial-gradient(ellipse at 50% 30%, rgba(59,130,246,0.08) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at 50% 30%, rgba(59,130,246,0.04) 0%, transparent 60%)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: isDarkMode
            ? 'radial-gradient(ellipse at 80% 70%, rgba(139,92,246,0.04) 0%, transparent 50%)'
            : 'none',
        }}
      />

      <AnimatePresence>
        {flashActive && (
          <motion.div
            key="flash"
            className="absolute inset-0 z-[100] pointer-events-none"
            style={{
              background: isDarkMode
                ? 'radial-gradient(ellipse at center, rgba(59,130,246,0.15) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, rgba(255,255,255,0.3) 40%, transparent 70%)',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {phase !== 'done' && (
          <motion.div
            key="content"
            className="relative w-full h-full flex items-center justify-center"
            exit={{
              scale: 0,
              opacity: 0,
              transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] },
            }}
          >
            <IntroLogo visibleChars={visibleChars} phase={phase} />

            <Suspense fallback={null}>
              {showNeural && <NeuralNetwork />}
            </Suspense>

            <LoadingProgress
              progress={progress}
              loadingMessage={loadingMessage}
              phase={phase}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
