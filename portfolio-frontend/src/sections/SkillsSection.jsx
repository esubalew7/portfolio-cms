import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, itemVariant } from '../animations/variants';
import { useContentStore } from '../store/contentStore';
import { SkillsSkeleton } from '../components/SkeletonLoader';
import {
  FaHtml5, FaCss3Alt, FaJs, FaBootstrap, FaReact, FaNodeJs,
  FaDatabase, FaGitAlt, FaGithub, FaJava, FaPhp,
} from 'react-icons/fa';
import {
  SiTailwindcss, SiExpress, SiMongodb, SiCplusplus,
  SiFlutter, SiPostman, SiFirebase,
} from 'react-icons/si';

const iconMap = {
  "HTML": <FaHtml5 className="text-orange-500 text-lg flex-shrink-0" />,
  "CSS": <FaCss3Alt className="text-blue-500 text-lg flex-shrink-0" />,
  "JavaScript": <FaJs className="text-yellow-400 text-lg flex-shrink-0" />,
  "Bootstrap": <FaBootstrap className="text-purple-600 text-lg flex-shrink-0" />,
  "Tailwind CSS": <SiTailwindcss className="text-cyan-400 text-lg flex-shrink-0" />,
  "React": <FaReact className="text-blue-400 text-lg flex-shrink-0" />,
  "Node.js": <FaNodeJs className="text-green-500 text-lg flex-shrink-0" />,
  "Express.js": <SiExpress className="text-gray-400 text-lg flex-shrink-0" />,
  "MongoDB": <SiMongodb className="text-green-600 text-lg flex-shrink-0" />,
  "mySQL": <FaDatabase className="text-indigo-500 text-lg flex-shrink-0" />,
  "Firebase": <SiFirebase className="text-orange-600 text-lg flex-shrink-0" />,
  "C++": <SiCplusplus className="text-blue-600 text-lg flex-shrink-0" />,
  "Java": <FaJava className="text-red-600 text-lg flex-shrink-0" />,
  "Flutter": <SiFlutter className="text-cyan-500 text-lg flex-shrink-0" />,
  "PHP": <FaPhp className="text-indigo-400 text-lg flex-shrink-0" />,
  "Git": <FaGitAlt className="text-orange-600 text-lg flex-shrink-0" />,
  "GitHub": <FaGithub className="text-gray-900 dark:text-gray-100 text-lg flex-shrink-0" />,
  "Postman": <SiPostman className="text-orange-600 text-lg flex-shrink-0" />,
};

const categoryIcons = {
  "Frontend": (
    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  "Backend": (
    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  ),
  "Database": (
    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  "Programming": (
    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  "Tools": (
    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
};

export const SkillsSection = () => {
  const { content, loading, error, retry } = useContentStore();
  const { skills } = content;

  const categories = skills?.categories || [];

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
    <section id="skills" className="container mx-auto px-4 py-10 md:py-20 max-w-7xl">
      <motion.div
        variants={staggerContainer(0.1, 0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div variants={fadeIn('up', 0.1)} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">{skills?.title || "Core Skills"}</h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {skills?.subtitle || ""}
          </p>
        </motion.div>

        {categories.length > 0 && (
          <motion.div variants={staggerContainer(0.15, 0.2)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariant}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl shadow-gray-100/50 dark:shadow-none border border-gray-100 dark:border-gray-800 transition-all"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm">
                    {categoryIcons[category.name] || (
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{category.name}</h3>
                </div>

                <div className="space-y-6">
                  {(category.items || []).map((skill, i) => (
                    <div key={i} className="group cursor-default">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          {iconMap[skill.name] || (
                            <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
                              {skill.name[0]}
                            </span>
                          )}
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {skill.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 relative"
                        >
                          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 rounded-r-full blur-[2px]"></div>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};
