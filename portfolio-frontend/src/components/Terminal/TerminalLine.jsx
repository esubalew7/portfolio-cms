import { memo } from 'react';
import { PromptPrefix } from './TerminalPrompt';

const ProcessingDots = () => (
  <span>
    Processing<span className="processing-dots">...</span>
  </span>
);

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

  if (line.type === 'processing') {
    return (
      <div className="text-[#888] leading-[1.4]">
        <ProcessingDots />
      </div>
    );
  }

  if (line.type === 'interrupt') {
    return (
      <div className="text-[#d4d4d4] leading-[1.4]">
        {line.content}
      </div>
    );
  }

  if (line.type === 'abort') {
    return (
      <div className="text-[#f48771] leading-[1.4]">
        {line.content}
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
