import { forwardRef } from 'react';
import { formatPrompt } from './terminalConstants';

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
      <div className="flex items-start min-h-[1.5rem] mt-1">
        <PromptPrefix />
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
          className="flex-1 min-w-0 bg-transparent text-[#e8e8e8] outline-none border-none p-0 m-0 font-mono text-[13px] leading-6 caret-[#33ff33] selection:bg-[#264f78]"
        />
      </div>
    );
  }
);

TerminalPrompt.displayName = 'TerminalPrompt';

export function PromptPrefix() {
  const prompt = formatPrompt();
  const [userHost, pathAndSig] = prompt.split(':');

  return (
    <span className="shrink-0 select-none font-mono text-[13px] leading-6">
      <span className="text-[#33ff33]">{userHost}</span>
      <span className="text-[#9ca3af]">:</span>
      <span className="text-[#5ea8ff]">{pathAndSig.replace('$', '')}</span>
      <span className="text-[#e8e8e8]">$ </span>
    </span>
  );
}

export default TerminalPrompt;
