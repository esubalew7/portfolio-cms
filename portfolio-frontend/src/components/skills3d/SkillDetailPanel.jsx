import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useGalaxyInteraction } from '../../hooks/useSkillInteraction';
import { getCategoryColor } from '../../utils/skillGalaxyConfig';

const SHEET_HEIGHT = '70vh';

const levelLabel = (lvl) => {
  if (lvl >= 90) return 'Expert';
  if (lvl >= 75) return 'Advanced';
  if (lvl >= 55) return 'Intermediate';
  return 'Beginner';
};

const formatExperience = (lvl) =>
  lvl >= 90 ? '5+ years' : lvl >= 75 ? '3-4 years' : lvl >= 55 ? '1-3 years' : '< 1 year';

const formatProjects = (lvl) =>
  lvl >= 90 ? '15+' : lvl >= 75 ? '8-14' : lvl >= 55 ? '3-7' : '1-3';

const detailItems = (selectedNode) => [
  { label: 'Proficiency', value: `${selectedNode?.level || 0}%` },
  { label: 'Experience', value: formatExperience(selectedNode?.level || 0) },
  { label: 'Projects', value: formatProjects(selectedNode?.level || 0) },
  { label: 'Level', value: levelLabel(selectedNode?.level || 0) },
];

export const SkillDetailPanel = React.memo(({ categoryName }) => {
  const { isDarkMode } = useTheme();
  const { selectedNode, clearSelection } = useGalaxyInteraction();

  const colors = getCategoryColor(categoryName || '');

  const handleDragEnd = useCallback((_, info) => {
    if (info.offset.y > 80) {
      clearSelection();
    }
  }, [clearSelection]);

  return (
    <AnimatePresence>
      {selectedNode && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40"
            style={{ background: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.25)' }}
            onClick={clearSelection}
          />
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350, mass: 0.8 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            style={{ zIndex: 50, height: SHEET_HEIGHT }}
            className={`
              fixed bottom-0 left-0 right-0
              rounded-t-3xl border shadow-2xl backdrop-blur-xl
              ${isDarkMode
                ? 'bg-gray-900/90 border-gray-700/40'
                : 'bg-white/90 border-gray-200/40'
              }
            `}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div
                className={`w-10 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
              />
            </div>

            <div className="px-6 pt-3 pb-8 overflow-y-auto h-full">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedNode.name}
                  </h3>
                  <span className="text-xs font-medium" style={{ color: colors.primary }}>
                    {categoryName || 'Skill'}
                  </span>
                </div>
                <button
                  onClick={clearSelection}
                  className={`
                    p-2 rounded-xl transition-all
                    ${isDarkMode
                      ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                    }
                  `}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-5">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Proficiency</span>
                  <span className="font-bold text-sm">{selectedNode.level}%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? '#1f2937' : '#e5e7eb' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedNode.level}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {detailItems(selectedNode).map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className={`
                      p-4 rounded-xl
                      ${isDarkMode ? 'bg-gray-800/60' : 'bg-gray-50/80'}
                    `}
                  >
                    <div className="text-xs font-medium mb-1" style={{ color: colors.primary }}>
                      {item.label}
                    </div>
                    <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.value}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
