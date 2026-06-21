import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../animations/variants";
import { Terminal } from "../components/Terminal";

export const TerminalSection = () => {
  return (
    <section id="terminal" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 max-w-6xl">
      <motion.div
        variants={staggerContainer(0.2, 0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="space-y-12"
      >
        <motion.div variants={fadeIn("up", 0.1)} className="text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Interactive Console
          </h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 mx-auto rounded-full mb-8"></div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Use this interactive terminal to explore my skills, experience, projects, or download my resume. Type{" "}
            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10 dark:bg-blue-500/20 px-2.5 py-1 rounded">
              help
            </span>{" "}
            to begin.
          </p>
        </motion.div>

        <motion.div
          variants={fadeIn("up", 0.2)}
          className="w-full relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-white/10"
        >
          {/* Subtle Glow behind the terminal */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl opacity-75 pointer-events-none" />

          <div className="relative">
            <Terminal isEmbedded={true} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
