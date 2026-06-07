import { motion } from 'framer-motion';

export const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer glowing rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute w-24 h-24 rounded-full border-t-2 border-b-2 border-l-2 border-transparent border-t-blue-600 border-b-blue-600 dark:border-t-blue-400 dark:border-b-blue-400"
        ></motion.div>

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute w-16 h-16 rounded-full border-t-2 border-b-2 border-r-2 border-transparent border-t-blue-400 border-b-blue-400 dark:border-t-blue-500 dark:border-b-blue-500 opacity-60"
        ></motion.div>

        {/* Inner pulsing dot */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-400"
        ></motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-[0.2em] uppercase"
      >
        Loading . . .
      </motion.p>
    </motion.div>
  );
};
