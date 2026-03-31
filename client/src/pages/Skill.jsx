import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, itemVariant } from '../animations/variants';

export const Skill = () => {
  const skills = [
    { name: 'MongoDB', category: 'Database' },
    { name: 'Express.js', category: 'Backend' },
    { name: 'React.js', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'Framer Motion', category: 'Animation' },
  ];

  return (
    <section className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
      <motion.div
        variants={staggerContainer(0.1, 0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={fadeIn('up', 0.1)} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Core Skills</h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div variants={staggerContainer(0.15, 0.2)} className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              variants={itemVariant}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 text-center cursor-pointer transition-shadow hover:shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{skill.name}</h3>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                {skill.category}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
