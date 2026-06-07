import { motion } from 'framer-motion';
import { useTypewriter } from '../hooks/useTypewriter';
import { SocialIconRow } from '../components/SocialLinks';
import { ParticlesBackground } from '../components/ParticlesBackground';

export const HeroSection = () => {
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
    <section id="home" className="relative min-h-screen flex items-center justify-center py-0 lg:py-10 overflow-hidden">
      {/* Background Particles limited to Hero boundaries */}
      <ParticlesBackground />

      {/* 2-Column Responsive Layout Wrapper */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-1 relative z-10 w-full max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-16 lg:gap-28">

          {/* Left Column: Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full md:w-1/2 lg:w-1/2 space-y-6 md:space-y-8 pointer-events-auto text-center md:text-left flex flex-col items-center md:items-start lg:pl-12"
          >
            <motion.div variants={itemVariants}>
              <p className="text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase mb-4 text-sm md:text-base">
                Hello, I am
              </p>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                Esubalew
              </h1>
            </motion.div>

            <motion.div variants={itemVariants} className="h-12 md:h-16 flex items-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                A passionate <br className="md:hidden" />
                <span className="inline-block text-blue-600 dark:text-blue-400 border-r-4 border-blue-600 dark:border-blue-400 pr-2 ml-1 animate-pulse">
                  {typedText}
                </span>
              </h2>
            </motion.div>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
              I am a Computer Science student and MERN Stack Developer with a passion for building dynamic web applications.
              I specialize in creating seamless user experiences and robust backend systems. Let's build something amazing together!
            </motion.p>

            {/* Call to Actions */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4 w-full sm:w-auto">
              <a
                href="#projects"
                className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-blue-500/30 w-full sm:w-auto text-lg text-center"
              >
                View Projects
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm hover:shadow-md w-full sm:w-auto text-lg hover:border-blue-200 dark:hover:border-gray-600 text-center"
              >
                Download Resume
              </a>
            </motion.div>

            {/* Social Icons perfectly aligned to text layout */}
            <motion.div variants={itemVariants} className="pt-6">
              <SocialIconRow className="gap-5 lg:gap-6 scale-105 origin-center md:origin-left" />
            </motion.div>
          </motion.div>

          {/* Right Column: Seamlessly Blending Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 lg:w-2/5 flex justify-center md:justify-end pointer-events-auto mt-8 md:mt-0"
          >
            {/* Floating animation wrapper */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem]"
            >
              {/* Subtle neutral ambient — matches portfolio background, no color cast */}
              <div className="absolute -inset-8 rounded-full
                bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,_transparent_75%)]
                dark:bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,_transparent_75%)]
                blur-2xl pointer-events-none" />

              {/* Image container — no background, fully transparent */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative w-full h-full rounded-full overflow-hidden z-10
                  border border-white/10 dark:border-white/5"
              >
                <img
                  src="/images/esu2.png"
                  alt="Esubalew"
                  className="w-full h-full object-cover object-top"
                />
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};