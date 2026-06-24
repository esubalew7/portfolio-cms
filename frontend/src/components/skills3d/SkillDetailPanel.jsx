import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useGalaxyInteraction } from '../../hooks/useSkillInteraction';
import { getCategoryColor } from '../../utils/skillGalaxyConfig';
import { BRAND_COLORS, getSlug } from '../../utils/techIcons';

const SHEET_HEIGHT = '70vh';

const levelMeta = (lvl) => {
  if (lvl >= 90) return { label: 'Expert', years: '5+ years', projects: '15+' };
  if (lvl >= 75) return { label: 'Advanced', years: '3-4 years', projects: '8-14' };
  if (lvl >= 55) return { label: 'Intermediate', years: '1-3 years', projects: '3-7' };
  return { label: 'Beginner', years: '< 1 year', projects: '1-3' };
};

const descriptionMap = {
  React: 'Building dynamic user interfaces with component-based architecture.',
  'Next.js': 'Full-stack React framework with SSR, SSG, and API routes.',
  TypeScript: 'Typed JavaScript superscript for scalable applications.',
  JavaScript: 'Core web language for interactive experiences.',
  HTML5: 'Semantic markup for modern web applications.',
  CSS3: 'Modern styling with layouts, animations, and responsive design.',
  TailwindCSS: 'Utility-first CSS framework for rapid UI development.',
  Bootstrap: 'Responsive component library for consistent design.',
  'Node.js': 'JavaScript runtime for building scalable server-side applications.',
  Express: 'Minimalist web framework for Node.js APIs.',
  'Socket.IO': 'Real-time bidirectional event-based communication.',
  'REST API': 'Stateless API design for web service integration.',
  MongoDB: 'NoSQL document database for flexible data storage.',
  MySQL: 'Relational database for structured data management.',
  PostgreSQL: 'Advanced relational database with robust features.',
  Java: 'Object-oriented language for enterprise applications.',
  'C++': 'High-performance systems programming language.',
  Python: 'Versatile language for web, data, and automation.',
  Git: 'Distributed version control for source code management.',
  GitHub: 'Platform for code hosting, collaboration, and CI/CD.',
  Docker: 'Container platform for consistent application deployment.',
  Postman: 'API development and testing platform.',
  'VS Code': 'Lightweight but powerful source code editor.',
  Cloudinary: 'Cloud-based media management and optimization.',
};

const projectsMap = {
  React: ['Portfolio CMS', 'Dashboard App', 'E-Commerce Platform', 'Analytics System'],
  'Next.js': ['Portfolio CMS', 'Marketing Site', 'Blog Platform'],
  TypeScript: ['Portfolio CMS', 'API Gateway', 'Type System Library'],
  JavaScript: ['Interactive Tools', 'Browser Extensions', 'CLI Utilities'],
  HTML5: ['Portfolio CMS', 'Landing Pages', 'Email Templates'],
  CSS3: ['Design System', 'Portfolio CMS', 'Component Library'],
  TailwindCSS: ['Portfolio CMS', 'Dashboard UI', 'Marketing Pages'],
  Bootstrap: ['Admin Panel', 'Corporate Site', 'Prototypes'],
  'Node.js': ['REST API Server', 'WebSocket Service', 'CLI Tools'],
  Express: ['Portfolio API', 'Auth Service', 'File Server'],
  'Socket.IO': ['Real-time Chat', 'Live Dashboard', 'Collaboration Tool'],
  'REST API': ['Portfolio API', 'Payment Gateway', 'Data Service'],
  MongoDB: ['Portfolio CMS', 'User Database', 'Analytics Store'],
  MySQL: ['E-Commerce DB', 'Blog Engine', 'CRM System'],
  PostgreSQL: ['Analytics DB', 'Geolocation Service', 'Data Warehouse'],
  Java: ['Android Apps', 'Desktop Tools', 'Backend Services'],
  'C++': ['Game Engine', 'Performance Tools', 'System Libraries'],
  Python: ['Data Scripts', 'Automation Tools', 'Web Scrapers'],
  Git: ['All Projects', 'Open Source Contributions', 'Team Workflows'],
  GitHub: ['Portfolio CMS', 'Open Source', 'CI/CD Pipelines'],
  Docker: ['Dev Environment', 'CI/CD Pipeline', 'Production Deploy'],
  Postman: ['API Testing', 'Documentation', 'Integration Tests'],
  'VS Code': ['Daily Development', 'Extensions', 'Custom Configs'],
  Cloudinary: ['Image Optimization', 'Video Processing', 'Asset Storage'],
};

export const SkillDetailPanel = React.memo(({ categoryName }) => {
  const { isDarkMode } = useTheme();
  const { selectedNode, clearSelection } = useGalaxyInteraction();

  const colors = getCategoryColor(categoryName || '');
  const meta = selectedNode ? levelMeta(selectedNode.level) : { label: '', years: '', projects: '' };
  const brandColor = selectedNode ? (BRAND_COLORS[selectedNode.name] || colors.primary) : colors.primary;
  const slug = selectedNode ? getSlug(selectedNode.name) : '';
  const description = selectedNode ? (descriptionMap[selectedNode.name] || 'Technology used in professional projects.') : '';
  const projects = selectedNode ? (projectsMap[selectedNode.name] || ['Various Projects']) : [];

  const handleDragEnd = useCallback((_, info) => {
    if (info.offset.y > 80) {
      clearSelection();
    }
  }, [clearSelection]);

  const detailItems = useMemo(() => {
    const m = selectedNode ? levelMeta(selectedNode.level) : { label: '', years: '', projects: '' };
    return [
      { label: 'Proficiency', value: `${selectedNode?.level || 0}%` },
      { label: 'Experience', value: m.years },
      { label: 'Projects Built', value: m.projects },
      { label: 'Level', value: m.label },
    ];
  }, [selectedNode]);

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
            style={{ background: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.25)' }}
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
              <div className={`w-10 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
            </div>

            <div className="px-6 pt-2 pb-8 overflow-y-auto h-full scroll-smooth">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0"
                    style={{ backgroundColor: brandColor + '20' }}
                  >
                    {slug && (
                      <img
                        src={`https://cdn.simpleicons.org/${slug}`}
                        alt={selectedNode.name}
                        className="w-7 h-7"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedNode.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: colors.primary }}>
                        {categoryName || 'Skill'}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: brandColor, backgroundColor: brandColor + '15' }}>
                        {meta.label}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={clearSelection}
                  className={`
                    p-2 rounded-xl transition-all shrink-0
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

              <p className={`text-sm mb-4 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {description}
              </p>

              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Proficiency</span>
                  <span className="font-bold text-xs">{selectedNode.level}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? '#1f2937' : '#e5e7eb' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedNode.level}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${colors.primary}, ${brandColor})` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {detailItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className={`
                      p-3 rounded-xl
                      ${isDarkMode ? 'bg-gray-800/60' : 'bg-gray-50/80'}
                    `}
                  >
                    <div className="text-[10px] font-medium mb-0.5" style={{ color: colors.primary }}>
                      {item.label}
                    </div>
                    <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.value}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div>
                <div className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Used In
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {projects.map((proj, i) => (
                    <motion.span
                      key={proj}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.04 }}
                      className={`
                        px-2.5 py-1 text-[10px] font-medium rounded-lg border
                        ${isDarkMode
                          ? 'bg-gray-800/80 border-gray-700/50 text-gray-300'
                          : 'bg-gray-100/80 border-gray-200/50 text-gray-600'
                        }
                      `}
                      style={{ borderColor: brandColor + '30' }}
                    >
                      {proj}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
