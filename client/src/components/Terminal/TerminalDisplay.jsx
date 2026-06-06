import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import TypingEffect from "./TypingEffect";

/**
 * Terminal Display Component
 * Shows command history with proper formatting and animations
 */
const TerminalDisplay = forwardRef(({ history, className }, ref) => {
  const scrollToBottom = () => {
    if (ref?.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  // Expose scroll method for parent
  React.useImperativeHandle(ref, () => ({
    scrollToBottom,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  if (history.length === 0) {
    return (
      <div className={`${className} justify-center items-center`}>
        <div className="text-center text-gray-500 text-sm font-mono">
          <p>Terminal ready...</p>
          <p className="text-xs mt-2 text-gray-600">Type 'help' to begin</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {history.map((entry, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="space-y-1"
        >
          {entry.type === "welcome" && (
            <TerminalWelcome content={entry.content} />
          )}

          {entry.type === "command" && (
            <TerminalCommand content={entry.content} />
          )}

          {entry.type === "response" && (
            <TerminalResponse
              content={entry.content}
              animated={entry.animated}
            />
          )}

          {entry.type === "error" && <TerminalError content={entry.content} />}
        </motion.div>
      ))}
    </motion.div>
  );
});

TerminalDisplay.displayName = "TerminalDisplay";

/**
 * Welcome Message Component
 */
const TerminalWelcome = ({ content }) => (
  <div className="text-cyan-400 text-xs font-mono whitespace-pre-wrap break-words leading-relaxed animate-pulse">
    {content}
  </div>
);

/**
 * Command Input Display Component
 */
const TerminalCommand = ({ content }) => (
  <div className="flex items-start gap-2">
    <span className="text-green-500 text-xs font-mono flex-shrink-0 mt-0.5">
      →
    </span>
    <span className="text-white text-xs font-mono break-words">
      {content}
    </span>
  </div>
);

/**
 * Command Response Component
 */
const TerminalResponse = ({ content, animated = false }) => {
  if (animated) {
    return (
      <div className="text-gray-300 text-xs font-mono leading-relaxed">
        <TypingEffect
          text={content}
          speed={8}
          className="whitespace-pre-wrap break-words"
        />
      </div>
    );
  }

  return (
    <div className="text-gray-300 text-xs font-mono whitespace-pre-wrap break-words leading-relaxed">
      {content}
    </div>
  );
};

/**
 * Error Message Component
 */
const TerminalError = ({ content }) => (
  <div className="text-red-400 text-xs font-mono whitespace-pre-wrap break-words leading-relaxed">
    {content}
  </div>
);

export default TerminalDisplay;
