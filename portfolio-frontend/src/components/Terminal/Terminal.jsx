import { useRef } from 'react';
import { motion } from 'framer-motion';
import TerminalViewport from './TerminalViewport';
import { useTerminal } from './useTerminal';

const Terminal = ({
  className = '',
  isEmbedded = false,
}) => {
  const inputRef = useRef(null);

  const {
    lines,
    input,
    setInput,
    executeCommand,
    clearTerminal,
    navigateHistory,
    autocomplete,
    handleInterrupt,
    viewportRef,
    commandCount,
  } = useTerminal();

  return (
    <>
      <style>{'@keyframes blink-cursor{50%{opacity:0}}@keyframes dotPulse{0%,20%{opacity:0.3}40%{opacity:1}60%,100%{opacity:0.3}}.processing-dots{animation:dotPulse 1.2s ease-in-out infinite}'}</style>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={`relative w-full ${isEmbedded ? 'h-[380px]' : 'h-[520px]'} ${className}`}
    >
      <div className="h-full flex flex-col rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#0c0c0c] shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
        <header className="h-7 shrink-0 flex items-center bg-[#1a1a1a] border-b border-[#2a2a2a] px-3 select-none">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#569cd6]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 8h2v2H7V8zm4 0h6v2h-6V8zm-4 4h2v2H7v-2zm4 0h6v2h-6v-2z" />
            </svg>
            <span className="text-[11px] text-[#b0b0b0] font-mono ml-1.5">Command Prompt</span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-[10px] text-[#666] font-mono select-none">
              {commandCount > 0 && `${commandCount} cmd`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => inputRef.current?.focus()}
              className="w-[26px] h-[22px] flex items-center justify-center rounded-sm hover:bg-[#333] text-[#777] text-xs leading-none transition-colors"
              aria-label="Focus terminal"
              tabIndex={-1}
            >
              _
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.focus()}
              className="w-[26px] h-[22px] flex items-center justify-center rounded-sm hover:bg-[#333] text-[#777] text-xs leading-none transition-colors"
              aria-label="Maximize"
              tabIndex={-1}
            >
              □
            </button>
            <button
              type="button"
              onClick={clearTerminal}
              className="w-[26px] h-[22px] flex items-center justify-center rounded-sm hover:bg-[#e81123] hover:text-white text-[#777] text-xs leading-none transition-colors"
              aria-label="Clear terminal"
            >
              ×
            </button>
          </div>
        </header>

        <TerminalViewport
          ref={viewportRef}
          lines={lines}
          input={input}
          onInputChange={setInput}
          onSubmit={executeCommand}
          onNavigateHistory={navigateHistory}
          onAutocomplete={autocomplete}
          onInterrupt={handleInterrupt}
          inputRef={inputRef}
        />
      </div>
    </motion.div>
    </>
  );
};

export default Terminal;
