import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerContainer } from '../animations/variants';
import { useContentStore } from '../store/contentStore';
import { SkillsSkeleton } from '../components/SkeletonLoader';
import { SkillGalaxy } from '../components/skills3d/SkillGalaxy';
import { useTheme } from '../context/ThemeContext';
import { getCategoryColor } from '../utils/skillGalaxyConfig';

export const SkillsSection = () => {
  const { isDarkMode } = useTheme();
  const { content, loading, error, retry } = useContentStore();
  const { skills } = content;
  const categories = skills?.categories || [];

  const [activeCategory, setActiveCategory] = useState(null);
  const [entranceCount, setEntranceCount] = useState(0);

  const totalSkills = useMemo(() => {
    return categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
  }, [categories]);

  const avgLevel = useMemo(() => {
    const all = categories.flatMap((cat) => cat.items || []);
    if (all.length === 0) return 0;
    return Math.round(all.reduce((s, i) => s + (i.level || 0), 0) / all.length);
  }, [categories]);

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
        onViewportEnter={() => setEntranceCount((c) => c + 1)}
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

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-white/60 border-gray-200'} backdrop-blur-sm`}>
                <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {categories.length}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Categories</div>
              </div>
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-white/60 border-gray-200'} backdrop-blur-sm`}>
                <div className="text-2xl font-extrabold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                  {totalSkills}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Technologies</div>
              </div>
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-white/60 border-gray-200'} backdrop-blur-sm`}>
                <div className="text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {avgLevel}%
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg. Proficiency</div>
              </div>
              <div className="p-4 rounded-xl border border-transparent flex items-center justify-center">
                <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                  Hover nodes to explore
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((cat) => {
                const colors = getCategoryColor(cat.name);
                const isActive = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onMouseEnter={() => setActiveCategory(cat.name)}
                    onMouseLeave={() => setActiveCategory(null)}
                    onClick={() => setActiveCategory(isActive ? null : cat.name)}
                    className={`
                      px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border
                      ${isActive
                        ? 'shadow-lg scale-105'
                        : 'opacity-70 hover:opacity-100'
                      }
                      ${isDarkMode
                        ? 'bg-gray-800/60 border-gray-700 text-gray-300'
                        : 'bg-gray-100/60 border-gray-200 text-gray-600'
                      }
                    `}
                    style={{
                      borderColor: isActive ? colors.primary : undefined,
                      boxShadow: isActive ? `0 0 12px ${colors.glow}40` : undefined,
                    }}
                  >
                    {cat.name}
                  </button>
                );
              })}
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
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
