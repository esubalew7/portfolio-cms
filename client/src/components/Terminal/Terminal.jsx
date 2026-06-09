import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TerminalViewport from './TerminalViewport';
import { useTerminal } from './useTerminal';

const Terminal = ({
  isOpen = true,
  onClose,
  position = { x: 40, y: 60 },
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
    viewportRef,
    commandCount,
  } = useTerminal();

  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const clampPosition = (pos) => {
    const margin = 12;
    return {
      x: Math.max(margin, Math.min(pos.x, window.innerWidth - margin)),
      y: Math.max(margin, Math.min(pos.y, window.innerHeight - margin)),
    };
  };

  const [terminalPosition, setTerminalPosition] = useState(() =>
    clampPosition(position)
  );

  const handleViewportClick = (e) => {
    if (e.target.closest('input') || e.target.closest('button')) return;
    const selection = window.getSelection()?.toString();
    if (selection) return;
    inputRef.current?.focus();
  };

  const handleClose = () => {
    if (isEmbedded) {
      clearTerminal();
    } else {
      onClose?.();
    }
  };

  const handleMouseDown = (e) => {
    if (isEmbedded || e.target.closest('.terminal-viewport')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - terminalPosition.x,
      y: e.clientY - terminalPosition.y,
    });
  };

  useEffect(() => {
    if (isEmbedded) return undefined;

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setTerminalPosition(
        clampPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        })
      );
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }

    return undefined;
  }, [isDragging, dragOffset, isEmbedded]);

  if (!isOpen && !isEmbedded) return null;

  const shellHeight = isMinimized
    ? 'h-10'
    : isEmbedded
      ? isExpanded
        ? 'h-[680px]'
        : 'h-[500px]'
      : 'h-[600px]';

  return (
    <motion.div
      initial={isEmbedded ? { opacity: 0, y: 24 } : { opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className={`${
        isEmbedded
          ? `relative w-full transition-all duration-300 ${shellHeight}`
          : `fixed z-50 w-full md:w-[820px] lg:w-[920px] ${shellHeight}`
      } ${className}`}
      style={
        isEmbedded
          ? undefined
          : {
              left: `${terminalPosition.x}px`,
              top: `${terminalPosition.y}px`,
              cursor: isDragging ? 'grabbing' : 'default',
            }
      }
    >
      <div className="h-full flex flex-col rounded-xl overflow-hidden border border-[#3a3a3a] bg-[#0d0d0d] shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <header
          onMouseDown={handleMouseDown}
          className={`h-9 shrink-0 flex items-center justify-between px-3 bg-[#2b2b2b] border-b border-[#1f1f1f] ${
            isEmbedded ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition"
              aria-label={isEmbedded ? 'Clear terminal' : 'Close terminal'}
            />
            <button
              type="button"
              onClick={() => setIsMinimized((v) => !v)}
              className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 transition"
              aria-label="Minimize terminal"
            />
            <button
              type="button"
              onClick={() => isEmbedded && setIsExpanded((v) => !v)}
              className={`w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 transition ${
                isEmbedded ? '' : 'opacity-60 cursor-default'
              }`}
              aria-label="Expand terminal"
            />
          </div>

          <span className="absolute left-1/2 -translate-x-1/2 text-[11px] text-[#b0b0b0] font-mono tracking-wide">
            esubalew@portfolio — bash
          </span>

          <span className="text-[10px] text-[#777] font-mono tabular-nums">
            {commandCount} cmds
          </span>
        </header>

        <AnimatePresence initial={false}>
          {!isMinimized && (
            <motion.div
              key="viewport"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="terminal-viewport flex-1 min-h-0 flex flex-col bg-[#0d0d0d]"
            >
              <TerminalViewport
                ref={viewportRef}
                lines={lines}
                input={input}
                onInputChange={setInput}
                onSubmit={executeCommand}
                onNavigateHistory={navigateHistory}
                onAutocomplete={autocomplete}
                inputRef={inputRef}
                onViewportClick={handleViewportClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Terminal;
