import { forwardRef, useState, useEffect } from 'react';

const TerminalPrompt = forwardRef(
  (
    {
      value,
      onChange,
      onSubmit,
      onNavigateHistory,
      onAutocomplete,
    },
    ref
  ) => {
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
      const id = setInterval(() => setShowCursor((v) => !v), 530);
      return () => clearInterval(id);
    }, []);

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSubmit(value);
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        onNavigateHistory(-1);
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        onNavigateHistory(1);
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        onAutocomplete();
      }
    };

    return (
      <div className="flex items-stretch">
        <PromptPrefix />
        <div className="relative flex-1 min-w-0">
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            aria-label="Terminal command input"
            className="w-full bg-transparent text-transparent outline-none border-none p-0 m-0 font-mono text-[13px] leading-[1.5rem] caret-transparent selection:bg-[#264f78]"
          />
          <span
            className="absolute inset-0 pointer-events-none font-mono text-[13px] leading-[1.5rem] text-[#d4d4d4] whitespace-pre"
            aria-hidden
          >
            {value}
            {showCursor && (
              <span className="inline-block w-[7px] h-[15px] bg-[#d4d4d4] align-[-2px] ml-px" />
            )}
          </span>
        </div>
      </div>
    );
  }
);

TerminalPrompt.displayName = 'TerminalPrompt';

export function PromptPrefix() {
  return (
    <span className="shrink-0 select-none font-mono text-[13px] leading-[1.5rem] whitespace-nowrap">
      <span className="text-[#569cd6]">E</span>
      <span className="text-[#888]"> </span>
      <span className="text-[#d4d4d4]">C:\esubalew\portfolio</span>
      <span className="text-[#569cd6]">&gt;</span>
      <span className="text-[#888]"> </span>
    </span>
  );
}

export default TerminalPrompt;
