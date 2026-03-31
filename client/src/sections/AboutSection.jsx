import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../animations/variants';
import { AnimatedCounter } from '../components/AnimatedCounter';

export const AboutSection = () => {
  const stats = [
    { label: 'Years Experience', value: 2, suffix: '+' },
    { label: 'Total Projects', value: 12, suffix: '+' }, // Adjust these numbers as needed!
    { label: 'Core Skills', value: 15, suffix: '' },
  ];

  return (
    <section id="about" className="container mx-auto px-4 py-20 md:py-32 max-w-6xl">
      <motion.div
        variants={staggerContainer(0.2, 0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="space-y-12"
      >
        <motion.div variants={fadeIn('up', 0.1)} className="text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">About Me</h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 mx-auto rounded-full mb-8"></div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Profile Image - Retained and styled */}
          <motion.div variants={fadeIn('right', 0.3)} className="w-full lg:w-5/12">
            <div className="aspect-[4/5] bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 relative group">
               <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/40">
                 {/* Visual placeholder enhancement */}
                 <svg className="w-24 h-24 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                 </svg>
                 <span className="font-semibold tracking-widest uppercase text-sm">[Profile Image Placeholder]</span>
               </div>
               <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/30 transition-colors duration-500 rounded-3xl pointer-events-none"></div>
            </div>
          </motion.div>

          {/* Professional Context */}
          <motion.div variants={fadeIn('left', 0.4)} className="w-full lg:w-7/12 space-y-8">
            <div className="space-y-6">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Software Engineer & <br className="hidden md:block"/>
                <span className="text-blue-600 dark:text-blue-400">MERN Stack Developer</span>
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                I am a third-year Computer Science student at Bahir Dar University, where I combine rigorous academic theory with hands-on, practical engineering. My true passion lies in architecting full-stack web applications that bridge the gap between complex backend data models and elegant front-end user interfaces.
              </p>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                As a developer, I am deeply committed to writing clean, modular code and designing robust, scalable systems. My approach prioritizes modern UI/UX principles, ensuring that my software is not just powerful under the hood, but intuitive for every end-user. Backed by an aggressive learning mindset, I constantly explore emerging technologies to stay ahead of the curve.
              </p>
            </div>

            {/* Animated Counters Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-gray-100 dark:border-gray-800">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="text-4xl lg:text-5xl font-extrabold text-blue-600 dark:text-blue-400 flex items-baseline">
                    <AnimatedCounter from={0} to={stat.value} duration={2.5} />
                    <span className="text-3xl">{stat.suffix}</span>
                  </h4>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Call to action button */}
            <div className="pt-6">
              <a 
                href="#contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Let's Collaborate
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
