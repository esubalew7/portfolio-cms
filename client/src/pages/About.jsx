import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../animations/variants';

export const About = () => {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
      <motion.div
        variants={staggerContainer(0.2, 0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="space-y-8"
      >
        <motion.div variants={fadeIn('up', 0.1)} className="text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">About Me</h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 mx-auto rounded-full mb-8"></div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div variants={fadeIn('right', 0.3)} className="w-full md:w-1/2">
            <div className="aspect-square bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                <img src="/images/esu1.png" alt="Esubale profile image" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeIn('left', 0.4)} className="w-full md:w-1/2 space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Transforming ideas into digital reality
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              I am a dedicated MERN Stack Developer with a strong focus on creating dynamic, interactive, and highly performant web applications.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              My journey in software development is driven by a constant desire to learn and solve complex problems using elegant solutions and modern architecture.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
