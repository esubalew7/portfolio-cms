import { motion } from 'framer-motion';
import { useTypewriter } from '../hooks/useTypewriter';
import { Link } from 'react-router-dom';
import { ParticlesBackground } from './ParticlesBackground';

export const Hero = () => {
  const roles = [
    'MERN Stack Developer.',
    'Problem Solver.',
    'Creative Thinker.',
    'React Enthusiast.'
  ];
  
  const typedText = useTypewriter(roles);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-20 overflow-hidden">
      <ParticlesBackground />
      {/* 
        Wrap with pointer-events-none so particles interact with the mouse hovering 
        background empty space, but buttons retain pointer-events-auto 
      */}
      <div className="container mx-auto px-6 text-center max-w-4xl relative z-10 pointer-events-none">
        <motion.div
           variants={containerVariants}
           initial="hidden"
           animate="visible"
           className="space-y-8 pointer-events-auto"
        >
          <motion.div variants={itemVariants}>
            <p className="text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase mb-4 text-sm md:text-base">
              Hello, I am
            </p>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              Esubalew
            </h1>
          </motion.div>

          <motion.div variants={itemVariants} className="h-12 md:h-20 flex items-center justify-center">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-700 dark:text-gray-300">
              A passionate <br className="md:hidden" />
              <span className="text-blue-600 dark:text-blue-400 border-r-4 border-blue-600 dark:border-blue-400 pr-2 ml-1 animate-pulse">
                {typedText}
              </span>
            </h2>
          </motion.div>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            I specialize in building exceptional digital experiences. Currently, I'm focused on 
            building scalable, responsive full-stack web applications to solve real-world problems.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link 
              to="/projects"
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-blue-500/30 w-full sm:w-auto text-lg"
            >
              View Projects
            </Link>
            <a 
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm hover:shadow-md w-full sm:w-auto text-lg hover:border-blue-200 dark:hover:border-gray-600"
            >
              Download Resume
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
