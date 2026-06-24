import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useGalaxyInteraction } from '../../hooks/useSkillInteraction';
import { getCategoryColor } from '../../utils/skillGalaxyConfig';

const levelLabel = (level) => {
  if (level >= 90) return 'Expert';
  if (level >= 75) return 'Advanced';
  if (level >= 55) return 'Intermediate';
  return 'Beginner';
};

const experienceYears = (level) => {
  if (level >= 90) return '5+ years';
  if (level >= 75) return '3-4 years';
  if (level >= 55) return '1-3 years';
  return '< 1 year';
};

const projectsCount = (level) => {
  if (level >= 90) return '15+';
  if (level >= 75) return '8-14';
  if (level >= 55) return '3-7';
  return '1-3';
};

const levelColor = (level, isDark) => {
  if (level >= 90) return isDark ? '#22c55e' : '#16a34a';
  if (level >= 75) return isDark ? '#3b82f6' : '#2563eb';
  if (level >= 55) return isDark ? '#f59e0b' : '#d97706';
  return isDark ? '#ef4444' : '#dc2626';
};

export const SkillTooltip = React.memo(({ categoryName }) => {
  const { isDarkMode } = useTheme();
  const { hoveredNode, hoveredScreenPos } = useGalaxyInteraction();

  const colors = getCategoryColor(categoryName || '');

  return (
    <AnimatePresence>
      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            left: hoveredScreenPos.x + 20,
            top: hoveredScreenPos.y - 20,
            transform: 'translateY(-100%)',
            zIndex: 50,
            pointerEvents: 'none',
          }}
          className={`
            px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-xl min-w-[200px]
            ${isDarkMode
              ? 'bg-gray-900/80 border-gray-700/50 text-white'
              : 'bg-white/80 border-gray-200/50 text-gray-900'
            }
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold tracking-tight">{hoveredNode.name}</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                color: levelColor(hoveredNode.level, isDarkMode),
                backgroundColor: isDarkMode
                  ? `${levelColor(hoveredNode.level, true)}15`
                  : `${levelColor(hoveredNode.level, false)}15`,
              }}
            >
              {levelLabel(hoveredNode.level)}
            </span>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Proficiency</span>
              <span className="font-semibold text-xs">{hoveredNode.level}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? '#1f2937' : '#e5e7eb' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${hoveredNode.level}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-700/30 dark:border-gray-700/30">
            <div className="text-center">
              <div className="text-xs font-bold" style={{ color: colors.primary }}>{experienceYears(hoveredNode.level)}</div>
              <div className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Exp</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold" style={{ color: colors.primary }}>{projectsCount(hoveredNode.level)}</div>
              <div className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Projects</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold" style={{ color: colors.primary }}>{levelLabel(hoveredNode.level)}</div>
              <div className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Level</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
