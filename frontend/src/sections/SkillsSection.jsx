import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerContainer } from '../animations/variants';
import { useContentStore } from '../store/contentStore';
import { SkillsSkeleton } from '../components/SkeletonLoader';
import { SkillGalaxy } from '../components/skills3d/SkillGalaxy';
import { useTheme } from '../context/ThemeContext';
import { getCategoryColor } from '../utils/skillGalaxyConfig';
import { BRAND_COLORS, getSlug } from '../utils/techIcons';

function AnimatedCounter({ value, suffix = '', duration = 1.5 }) {
  const [display, setDisplay] = useState(0);
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [value, duration]);

  return <>{display}{suffix}</>;
}

const levelMeta = (level) => {
  if (level >= 90) return { label: 'Expert', projects: '15+', years: '5+' };
  if (level >= 75) return { label: 'Advanced', projects: '8-14', years: '3-4' };
  if (level >= 55) return { label: 'Intermediate', projects: '3-7', years: '1-3' };
  return { label: 'Beginner', projects: '1-3', years: '<1' };
};

function CategoryPopup({ category, isDarkMode, isVisible }) {
  const colors = getCategoryColor(category.name);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ zIndex: 60 }}
          className={`
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            min-w-[220px] rounded-xl border shadow-2xl backdrop-blur-xl overflow-hidden
            ${isDarkMode
              ? 'bg-gray-900/90 border-gray-700/50'
              : 'bg-white/90 border-gray-200/50'
            }
          `}
        >
          <div
            className="px-4 py-2.5 border-b text-xs font-bold tracking-wide flex items-center gap-2"
            style={{
              backgroundColor: colors.primary + '15',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              color: colors.primary,
            }}
          >
            <span>{category.name}</span>
            <span className="opacity-50">·</span>
            <span className="opacity-60 font-normal">{category.items?.length || 0} technologies</span>
          </div>
          <div className="p-2 space-y-0.5">
            {(category.items || []).map((item) => {
              const brandColor = BRAND_COLORS[item.name] || colors.primary;
              const meta = levelMeta(item.level);
              return (
                <div
                  key={item.name}
                  className={`
                    flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors
                    ${isDarkMode ? 'hover:bg-gray-800/60' : 'hover:bg-gray-50/80'}
                  `}
                >
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: brandColor + '20' }}
                  >
                    <img
                      src={`https://cdn.simpleicons.org/${getSlug(item.name)}`}
                      alt={item.name}
                      className="w-3.5 h-3.5"
                      loading="lazy"
                    />
                  </div>
                  <span className={`text-xs font-medium flex-1 truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                    style={{
                      color: brandColor,
                      backgroundColor: brandColor + '15',
                    }}
                  >
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const SkillsSection = () => {
  const { isDarkMode } = useTheme();
  const { content, loading, error, retry } = useContentStore();
  const { skills } = content;
  const categories = skills?.categories || [];

  const [activeCategory, setActiveCategory] = useState(null);
  const [focusCategory, setFocusCategory] = useState(null);
  const [hoveredCat, setHoveredCat] = useState(null);

  const totalSkills = useMemo(() => {
    return categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
  }, [categories]);

  const totalProjects = useMemo(() => {
    return categories.reduce((sum, cat) => sum + (cat.items?.length || 0) * 2, 12);
  }, [categories]);

  const masteredCount = useMemo(() => {
    const all = categories.flatMap((cat) => cat.items || []);
    return all.filter((i) => (i.level || 0) >= 80).length;
  }, [categories]);

  const handleCategoryClick = useCallback((catName) => {
    setFocusCategory((prev) => prev === catName ? null : catName);
  }, []);

  if (loading) return <SkillsSkeleton />;
  if (error) return (
    <section className="container mx-auto px-4 py-10 md:py-20 max-w-7xl">
      <div className="text-center space-y-4">
        <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
        <button onClick={retry} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          Retry
        </button>
      </div>
    </section>
  );

  return (
    <section id="skills" className="relative container mx-auto px-4 py-10 md:py-20 max-w-7xl overflow-hidden">
      <motion.div
        variants={staggerContainer(0.1, 0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        onViewportEnter={() => {}}
        className="relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px]">
          <motion.div variants={fadeIn('right', 0.15)} className="space-y-6 lg:pr-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                {skills?.title || "Core Skills"}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6" />
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
                {skills?.subtitle || "Technologies and tools I work with"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { value: categories.length, suffix: '', label: 'Categories', gradient: 'from-blue-500 to-purple-500' },
                { value: totalSkills, suffix: '', label: 'Technologies', gradient: 'from-green-500 to-blue-500' },
                { value: totalProjects, suffix: '+', label: 'Projects Built', gradient: 'from-purple-500 to-pink-500' },
                { value: masteredCount, suffix: '', label: 'Technologies Mastered', gradient: 'from-orange-500 to-red-500' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`
                    p-4 rounded-xl border backdrop-blur-sm transition-all duration-300
                    ${isDarkMode
                      ? 'bg-gray-900/60 border-gray-800 hover:border-gray-700/80'
                      : 'bg-white/60 border-gray-200 hover:border-gray-300/80'
                    }
                  `}
                >
                  <div className={`text-2xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className={`text-sm mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-2 relative">
              {categories.map((cat) => {
                const colors = getCategoryColor(cat.name);
                const isActive = activeCategory === cat.name;
                const isFocus = focusCategory === cat.name;
                return (
                  <div key={cat.name} className="relative">
                    <button
                      onMouseEnter={() => {
                        setActiveCategory(cat.name);
                        setHoveredCat(cat.name);
                      }}
                      onMouseLeave={() => {
                        setActiveCategory(null);
                        setHoveredCat(null);
                      }}
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border
                        ${isActive ? 'shadow-lg scale-105' : 'opacity-70 hover:opacity-100'}
                        ${isFocus
                          ? isDarkMode ? 'bg-gray-800 border-blue-500/50 text-blue-300' : 'bg-white border-blue-500/50 text-blue-700'
                          : isDarkMode
                            ? 'bg-gray-800/60 border-gray-700 text-gray-300'
                            : 'bg-gray-100/60 border-gray-200 text-gray-600'
                        }
                      `}
                      style={{
                        borderColor: isActive ? colors.primary : undefined,
                        boxShadow: isActive ? `0 0 12px ${colors.glow}40` : undefined,
                      }}
                    >
                      {isFocus ? '✓ ' : ''}{cat.name}
                    </button>
                    <CategoryPopup
                      category={cat}
                      isDarkMode={isDarkMode}
                      isVisible={hoveredCat === cat.name}
                    />
                  </div>
                );
              })}
              {focusCategory && (
                <button
                  onClick={() => setFocusCategory(null)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border
                    ${isDarkMode
                      ? 'bg-gray-800/80 border-gray-600 text-gray-400 hover:text-white'
                      : 'bg-gray-200/80 border-gray-300 text-gray-500 hover:text-gray-900'
                    }
                  `}
                >
                  Reset View
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={fadeIn('left', 0.2)}
            className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden"
          >
            <div className={`absolute inset-0 rounded-2xl ${isDarkMode ? 'bg-gray-900/30' : 'bg-gray-100/30'} backdrop-blur-[1px]`} />
            <SkillGalaxy
              categories={categories}
              title={skills?.title}
              subtitle={skills?.subtitle}
              entranceProgress={1}
              focusCategory={focusCategory}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
