import React, { useState } from "react";
import { Terminal } from "../components/Terminal";
import { motion } from "framer-motion";

/**
 * Terminal Demo Page
 * Shows how to use the Terminal component with various configurations
 */
const TerminalDemo = () => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-mono">
            Developer Terminal
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Premium interactive terminal component for your portfolio
          </p>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-6 max-w-2xl mx-auto"
          >
            <div className="text-left space-y-3">
              <h3 className="text-cyan-400 font-mono font-bold mb-4">
                Available Commands:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300 font-mono">
                <div>
                  <span className="text-green-400">→</span> help - Show all
                  commands
                </div>
                <div>
                  <span className="text-green-400">→</span> about - Learn about
                  me
                </div>
                <div>
                  <span className="text-green-400">→</span> skills - View my
                  skills
                </div>
                <div>
                  <span className="text-green-400">→</span> projects - Browse
                  projects
                </div>
                <div>
                  <span className="text-green-400">→</span> contact - Get in
                  touch
                </div>
                <div>
                  <span className="text-green-400">→</span> github - Visit GitHub
                </div>
                <div>
                  <span className="text-green-400">→</span> linkedin - Visit
                  LinkedIn
                </div>
                <div>
                  <span className="text-green-400">→</span> clear - Clear
                  terminal
                </div>
              </div>
            </div>
          </motion.div>

          {/* Control Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsTerminalOpen(!isTerminalOpen)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-mono font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              {isTerminalOpen ? "Hide" : "Show"} Terminal
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsTerminalOpen(false)}
              className="px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 font-mono font-bold rounded-lg hover:border-gray-600 transition-all"
            >
              Close Terminal
            </motion.button>
          </div>
        </motion.div>

        {/* Terminal Component */}
        <Terminal
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
          position={{ x: 40, y: 100 }}
        />
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-6 left-6 right-6 text-center text-sm text-gray-500 font-mono"
      >
        <p>💡 Drag the terminal header to move it around • Resize handle on bottom right</p>
      </motion.div>
    </div>
  );
};

export default TerminalDemo;
