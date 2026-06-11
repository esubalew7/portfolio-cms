import { memo } from 'react';
import TypingEffect from './TypingEffect';
import { PromptPrefix } from './TerminalPrompt';

const TerminalLine = memo(({ line }) => {
  if (line.type === 'welcome') {
    return (
      <div className="text-[#7dd3fc] whitespace-pre-wrap break-words mb-3 leading-[1.4]">
        {line.content}
      </div>
    );
  }

  if (line.type === 'command') {
    return (
      <div className="flex items-start">
        <PromptPrefix />
        <span className="text-[#d4d4d4] break-all">{line.content}</span>
      </div>
    );
  }

  if (line.type === 'error') {
    return (
      <div className="text-[#f48771] whitespace-pre-wrap break-words leading-[1.4]">
        {line.content}
      </div>
    );
  }

  if (line.animated) {
    return (
      <div className="text-[#c0c0c0] leading-[1.4]">
        <TypingEffect
          text={line.content}
          speed={12}
          className="whitespace-pre-wrap break-words"
        />
      </div>
    );
  }

  return (
    <div className="text-[#c0c0c0] whitespace-pre-wrap break-words leading-[1.4]">
      {line.content}
    </div>
  );
});

TerminalLine.displayName = 'TerminalLine';

export default TerminalLine;
