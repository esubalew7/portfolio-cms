import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Typing Animation Component
 * Animates text character by character for terminal responses
 */
const TypingEffect = ({
  text,
  speed = 10,
  onComplete = null,
  className = "",
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) {
      setIsComplete(true);
      return;
    }

    let currentIndex = 0;
    let timeoutId;

    const typeNextCharacter = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeNextCharacter, speed);
      } else {
        setIsComplete(true);
        if (onComplete) onComplete();
      }
    };

    timeoutId = setTimeout(typeNextCharacter, speed);

    return () => clearTimeout(timeoutId);
  }, [text, speed, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <pre className="font-mono text-xs whitespace-pre-wrap break-words">
        {displayedText}
        {!isComplete && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="text-cyan-400"
          >
            ▊
          </motion.span>
        )}
      </pre>
    </motion.div>
  );
};

export default TypingEffect;
