import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TerminalDisplay from "./TerminalDisplay";
import TerminalInput from "./TerminalInput";
import CommandParser from "./commandParser";
import { COMMAND_REGISTRY, WELCOME_MESSAGE } from "./commandRegistry";

/**
 * Premium Interactive Developer Terminal Component
 * Features: Mac-style UI, Glassmorphism, Animations, Command System, Parser
 * Modes: Floating (default, draggable) or Embedded (static section flow)
 */
const Terminal = ({
  isOpen = true,
  onClose,
  position = { x: 40, y: 60 },
  className = "",
  isEmbedded = false,
}) => {
  // Initialize command parser with registry
  const parserRef = useRef(new CommandParser(COMMAND_REGISTRY));

  const [history, setHistory] = useState([
    { type: "welcome", content: WELCOME_MESSAGE },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [terminalPosition, setTerminalPosition] = useState(position);

  const displayRef = useRef(null);
  const dragRef = useRef(null);
  const inputRef = useRef(null);

  const clampPosition = (pos) => {
    const margin = 12;
    const maxX = window.innerWidth - margin;
    const maxY = window.innerHeight - margin;

    return {
      x: Math.max(margin, Math.min(pos.x, maxX)),
      y: Math.max(margin, Math.min(pos.y, maxY)),
    };
  };

  // Ensure initial position is valid for the current viewport (only if floating)
  useEffect(() => {
    if (!isEmbedded) {
      setTerminalPosition((prev) => clampPosition(prev));
    }
  }, [isEmbedded]);

  // Auto-scroll to latest command
  useEffect(() => {
    if (displayRef.current) {
      setTimeout(() => {
        displayRef.current.scrollToBottom();
      }, 0);
    }
  }, [history]);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMinimized]);

  /**
   * Handle command execution with parser
   */
  const executeCommand = (command) => {
    if (!command.trim()) {
      setInputValue("");
      return;
    }

    const parsed = parserRef.current.parse(command);

    setHistory((prev) => [
      ...prev,
      { type: "command", content: command, timestamp: new Date() },
    ]);

    const result = parserRef.current.execute(parsed);

    if (result.type === "clear") {
      setHistory([]);
      setInputValue("");
      return;
    }

    if (result.type === "error") {
      setHistory((prev) => [
        ...prev,
        { type: "error", content: result.output },
      ]);
    } else if (result.type === "link") {
      setHistory((prev) => [
        ...prev,
        { type: "response", content: result.output, animated: false },
      ]);

      setTimeout(() => {
        window.open(result.url, "_blank", "noopener,noreferrer");
      }, 300);
    } else if (result.type === "download") {
      setHistory((prev) => [
        ...prev,
        { type: "response", content: result.output, animated: false },
      ]);

      setTimeout(() => {
        const link = document.createElement("a");
        link.href = result.fileUrl;
        link.download = result.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 300);
    } else {
      setHistory((prev) => [
        ...prev,
        { type: "response", content: result.output, animated: result.animated },
      ]);
    }

    setInputValue("");
  };

  // Handle drag functionality (only when floating)
  const handleMouseDown = (e) => {
    if (isEmbedded || e.target.closest(".terminal-content")) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - terminalPosition.x,
      y: e.clientY - terminalPosition.y,
    });
  };

  useEffect(() => {
    if (isEmbedded) return;

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      setTerminalPosition((prev) => {
        const next = {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        };
        return clampPosition(next);
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, isEmbedded]);

  // Handle click on terminal body to focus the prompt input
  const handleTerminalClick = (e) => {
    // If clicked on input or action buttons, don't interfere
    if (e.target.closest("input") || e.target.closest("button")) return;

    // If text selection is active, let the user copy/select
    const selection = window.getSelection().toString();
    if (selection) return;

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClose = () => {
    if (isEmbedded) {
      setHistory([
        { type: "response", content: "Terminal reset. Command history cleared. Type 'help' to see options.", animated: false }
      ]);
    } else if (onClose) {
      onClose();
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleMaximize = () => {
    if (isEmbedded) {
      setIsExpanded(!isExpanded);
    }
  };

  if (!isOpen && !isEmbedded) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={dragRef}
        onClick={handleTerminalClick}
        initial={isEmbedded ? { opacity: 0, y: 30 } : { opacity: 0, scale: 0.8, y: 20 }}
        animate={isEmbedded ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.5,
        }}
        className={`${isEmbedded
          ? `relative w-full transition-all duration-300 ${isMinimized ? "h-10" : isExpanded ? "h-[680px]" : "h-[500px]"}`
          : `fixed z-50 w-full md:w-[800px] lg:w-[900px] ${isMinimized ? "h-10" : "h-[600px]"}`
          } ${className}`}
        style={
          isEmbedded
            ? {}
            : {
              left: `${terminalPosition.x}px`,
              top: `${terminalPosition.y}px`,
              cursor: isDragging ? "grabbing" : "grab",
            }
        }
      >
        {/* Glassmorphism Background with Glow */}
        <motion.div
          className="absolute inset-0 rounded-lg bg-black/40 backdrop-blur-lg border border-white/10 overflow-hidden"
          initial={{ borderColor: "rgba(34, 211, 238, 0)" }}
          animate={{ borderColor: "rgba(34, 211, 238, 0.3)" }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {/* Subtle Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />
        </motion.div>

        {/* Terminal Header - Mac Style */}
        <motion.div
          onMouseDown={handleMouseDown}
          className={`relative h-10 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-b border-white/10 flex items-center px-4 justify-between select-none group ${isEmbedded ? "cursor-default" : "cursor-grab"
            }`}
          whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.85)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Mac Style Buttons */}
          <div className="flex gap-2 items-center">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
              title={isEmbedded ? "Clear Terminal" : "Close"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            />
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleMinimize}
              className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors"
              title="Minimize"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 200 }}
            />
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleMaximize}
              className={`w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors ${isEmbedded ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                }`}
              title={isEmbedded ? "Expand Height" : "Maximize (Embedded only)"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            />
          </div>

          {/* Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h3 className="text-xs font-mono text-gray-300 font-semibold tracking-wider">
              Esubalew@portfolio: ~
            </h3>
          </div>

          {/* Terminal Icons */}
          <div className="flex gap-2 text-gray-400 group-hover:text-gray-300 transition-colors">
            <div className="text-xs font-mono select-none">
              {history.length} command{history.length !== 1 ? "s" : ""}
            </div>
          </div>
        </motion.div>

        {/* Terminal Content */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="terminal-content relative h-[calc(100%-2.5rem)] flex flex-col bg-gray-900/30 overflow-hidden"
            >
              {/* Display Area */}
              <TerminalDisplay
                ref={displayRef}
                history={history}
                className="flex-1 overflow-y-auto p-4 space-y-3"
              />

              {/* Input Area */}
              <div className="border-t border-white/10 bg-gray-900/50 backdrop-blur-sm p-4">
                <TerminalInput
                  ref={inputRef}
                  value={inputValue}
                  onChange={setInputValue}
                  onExecute={executeCommand}
                  commandHistory={history.filter((h) => h.type === "command")}
                  commands={Object.keys(COMMAND_REGISTRY.commands)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default Terminal;
