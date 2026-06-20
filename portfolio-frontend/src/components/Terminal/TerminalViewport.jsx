import { forwardRef } from 'react';
import TerminalLine from './TerminalLine';
import TerminalPrompt from './TerminalPrompt';

const TerminalViewport = forwardRef(
  (
    {
      lines,
      input,
      onInputChange,
      onSubmit,
      onNavigateHistory,
      onAutocomplete,
      onInterrupt,
      inputRef,
    },
    viewportRef
  ) => {
    const handleClick = (e) => {
      if (e.target.closest('input') || e.target.closest('button')) return;
      const sel = window.getSelection()?.toString();
      if (sel) return;
      inputRef.current?.focus();
    };

    return (
      <div
        ref={viewportRef}
        onClick={handleClick}
        className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 font-mono text-[13px] leading-[1.5rem] scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="min-h-full flex flex-col justify-end">
          <div className="space-y-px">
            {lines.map((line) => (
              <TerminalLine key={line.id} line={line} />
            ))}
          </div>
          <TerminalPrompt
            ref={inputRef}
            value={input}
            onChange={onInputChange}
            onSubmit={onSubmit}
            onNavigateHistory={onNavigateHistory}
            onAutocomplete={onAutocomplete}
            onInterrupt={onInterrupt}
          />
        </div>
      </div>
    );
  }
);

TerminalViewport.displayName = 'TerminalViewport';

export default TerminalViewport;
