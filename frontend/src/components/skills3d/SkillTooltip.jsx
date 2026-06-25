import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useGalaxyInteraction } from '../../hooks/useSkillInteraction';
import { getCategoryColor } from '../../utils/skillGalaxyConfig';
import { BRAND_COLORS } from '../../utils/techIcons';

const levelMeta = (level) => {
  if (level >= 90) return { label: 'Expert', years: '5+ years', projects: '15+' };
  if (level >= 75) return { label: 'Advanced', years: '3-4 years', projects: '8-14' };
  if (level >= 55) return { label: 'Intermediate', years: '1-3 years', projects: '3-7' };
  return { label: 'Beginner', years: '< 1 year', projects: '1-3' };
};

const levelColor = (level, isDark) => {
  if (level >= 90) return { text: isDark ? '#22c55e' : '#16a34a', bg: isDark ? '#22c55e15' : '#16a34a15' };
  if (level >= 75) return { text: isDark ? '#3b82f6' : '#2563eb', bg: isDark ? '#3b82f615' : '#2563eb15' };
  if (level >= 55) return { text: isDark ? '#f59e0b' : '#d97706', bg: isDark ? '#f59e0b15' : '#d9770615' };
  return { text: isDark ? '#ef4444' : '#dc2626', bg: isDark ? '#ef444415' : '#dc262615' };
};

export const SkillTooltip = React.memo(({ categoryName }) => {
  const { isDarkMode } = useTheme();
  const { hoveredNode, hoveredScreenPos } = useGalaxyInteraction();

  const colors = getCategoryColor(categoryName || '');
  const meta = hoveredNode ? levelMeta(hoveredNode.level) : { label: '', years: '', projects: '' };
  const lc = hoveredNode ? levelColor(hoveredNode.level, isDarkMode) : { text: '', bg: '' };
  const brandColor = hoveredNode ? (BRAND_COLORS[hoveredNode.name] || colors.primary) : colors.primary;

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
            left: Math.min(hoveredScreenPos.x + 20, window.innerWidth - 260),
            top: Math.max(hoveredScreenPos.y - 20, 10),
            transform: 'translateY(-100%)',
            zIndex: 50,
            pointerEvents: 'none',
          }}
          className={`
            px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-xl min-w-[220px]
            ${isDarkMode
              ? 'bg-gray-900/85 border-gray-700/50 text-white'
              : 'bg-white/85 border-gray-200/50 text-gray-900'
            }
          `}
        >
          <div className="flex items-center gap-3 mb-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold shadow-sm shrink-0"
              style={{ backgroundColor: brandColor + '20', color: brandColor }}
            >
              <img loading="lazy"
                src={`https://cdn.simpleicons.org/${hoveredNode.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}`}
                alt={hoveredNode.name}
                className="w-5 h-5"
                loading="lazy"
              />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold tracking-tight truncate">{hoveredNode.name}</div>
              {categoryName && (
                <div className="text-[10px] font-medium opacity-60 truncate">{categoryName}</div>
              )}
            </div>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-auto"
              style={{ color: lc.text, backgroundColor: lc.bg }}
            >
              {meta.label}
            </span>
          </div>

          <div className="mb-2.5">
            <div className="flex justify-between text-[10px] mb-1">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Proficiency</span>
              <span className="font-semibold text-[10px]">{hoveredNode.level}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? '#1f2937' : '#e5e7eb' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${hoveredNode.level}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${colors.primary}, ${brandColor})` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-gray-700/20 dark:border-gray-700/20">
            {[
              { value: meta.label, label: 'Level' },
              { value: meta.years, label: 'Experience' },
              { value: meta.projects, label: 'Projects' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-[10px] font-bold" style={{ color: colors.primary }}>{item.value}</div>
                <div className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
