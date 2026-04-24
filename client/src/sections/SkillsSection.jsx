import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, itemVariant } from '../animations/variants';

const skillCategories = [
  {
    title: "Frontend",
    icon: (
      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    skills: [
      { name: "HTML", level: 95 },
      { name: "CSS", level: 90 },
      { name: "JavaScript", level: 85 },
      { name: "Bootstrap", level: 80 },
      { name: "Tailwind CSS", level: 95 },
      { name: "React", level: 90 }
    ]
  },
  {
    title: "Backend",
    icon: (
      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    skills: [
      { name: "Node.js", level: 80 },
      { name: "Express.js", level: 85 }
    ]
  },
  {
    title: "Database",
    icon: (
      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    skills: [
      { name: "MongoDB", level: 85 },
      { name: "SQL", level: 75 }
    ]
  },
  {
    title: "Programming",
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    skills: [
      { name: "C++", level: 75 },
      { name: "Java", level: 80 },
      { name: "Flutter", level: 65 },
      { name: "PHP", level: 70 }
    ]
  },
  {
    title: "Tools",
    icon: (
      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    skills: [
      { name: "Git", level: 85 },
      { name: "GitHub", level: 90 }
    ]
  }
];

export const SkillsSection = () => {
  return (
    <section id="skills" className="container mx-auto px-4 py-10 md:py-20 max-w-7xl">
      <motion.div
        variants={staggerContainer(0.1, 0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div variants={fadeIn('up', 0.1)} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Core Skills</h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise across modern web development, backend engineering, and foundational tooling.
          </p>
        </motion.div>

        {/* Skill Category Grid */}
        <motion.div variants={staggerContainer(0.15, 0.2)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariant}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl shadow-gray-100/50 dark:shadow-none border border-gray-100 dark:border-gray-800 transition-all"
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm">
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{category.title}</h3>
              </div>

              {/* Progress Bars */}
              <div className="space-y-6">
                {category.skills.map((skill, i) => (
                  <div key={i} className="group cursor-default">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {skill.name}
                      </span>
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {skill.level}%
                      </span>
                    </div>
                    {/* Background Bar */}
                    <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      {/* Animated Foreground component mapping exact widths dynamically */}
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 relative"
                      >
                        {/* Shimmer dot at end of loaded bar */}
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 rounded-r-full blur-[2px]"></div>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};