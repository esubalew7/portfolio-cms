import React, { useState, useEffect, useRef, forwardRef } from "react";

/**
 * Terminal Input Component
 * Handles command input with native caret, history navigation, and tab autocompletion.
 */
const TerminalInput = forwardRef(({
  value,
  onChange,
  onExecute,
  commandHistory = [],
  commands = [],
}, ref) => {
  const [historyIndex, setHistoryIndex] = useState(null);
  const [tempInput, setTempInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim()) {
        onExecute(value);
        setHistoryIndex(null);
        setTempInput("");
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      // If we haven't started navigating history, save current input
      if (historyIndex === null) {
        setTempInput(value);
      }
      navigateHistory(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      navigateHistory(1);
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleAutocomplete();
    }
  };

  const navigateHistory = (direction) => {
    const previousCommands = commandHistory.map((h) => h.content);

    if (previousCommands.length === 0) return;

    let newIndex;
    if (historyIndex === null) {
      if (direction === -1) {
        newIndex = previousCommands.length - 1;
      } else {
        return; // ArrowDown has no effect if not in history
      }
    } else {
      newIndex = historyIndex + direction;
    }

    if (newIndex < 0) {
      newIndex = 0; // Stay at oldest
    } else if (newIndex >= previousCommands.length) {
      // Exit history mode, restore tempInput
      setHistoryIndex(null);
      onChange(tempInput);
      return;
    }

    setHistoryIndex(newIndex);
    onChange(previousCommands[newIndex]);
  };

  const handleAutocomplete = () => {
    if (!value.trim()) return;

    const trimmedInput = value.toLowerCase().trim();
    // Default commands if not passed
    const commandList = commands.length > 0 ? commands : [
      "help", "about", "experience", "education",
      "techstack", "projects", "resume", "contact",
      "github", "linkedin", "clear"
    ];

    const matched = commandList.filter((cmd) => cmd.startsWith(trimmedInput));

    if (matched.length === 1) {
      onChange(matched[0]);
    } else if (matched.length > 1) {
      // Find current match and cycle to next
      const currentIndex = matched.indexOf(value.toLowerCase().trim());
      const nextIndex = (currentIndex + 1) % matched.length;
      onChange(matched[nextIndex]);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-gray-900/30 rounded px-3 py-2 border border-white/10 focus-within:border-cyan-500/50 transition-colors">
      {/* Prompt */}
      <div className="flex items-center gap-1 flex-shrink-0 select-none">
        <span className="text-green-500 text-xs font-mono font-bold">
          esubalew
        </span>
        <span className="text-gray-500 text-xs font-mono">@</span>
        <span className="text-cyan-400 text-xs font-mono font-bold">
          dev
        </span>
        <span className="text-gray-500 text-xs font-mono">~/</span>
      </div>

      {/* Input Field */}
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setTempInput(e.target.value);
          setHistoryIndex(null);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Type a command..."
        className="flex-1 bg-transparent text-white text-xs font-mono outline-none placeholder-gray-600 caret-cyan-400 selection:bg-cyan-500/30"
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  );
});

TerminalInput.displayName = "TerminalInput";

export default TerminalInput;
