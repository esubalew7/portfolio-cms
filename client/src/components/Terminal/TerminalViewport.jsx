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
      inputRef,
      onViewportClick,
    },
    viewportRef
  ) => {
    return (
      <div
        ref={viewportRef}
        onClick={onViewportClick}
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 font-mono text-[13px] leading-6 scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-transparent"
      >
        <div className="space-y-0.5 min-h-full flex flex-col">
          <div className="flex-1 space-y-0.5">
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
          />
        </div>
      </div>
    );
  }
);

TerminalViewport.displayName = 'TerminalViewport';

export default TerminalViewport;
