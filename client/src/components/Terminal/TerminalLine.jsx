import TypingEffect from './TypingEffect';
import { PromptPrefix } from './TerminalPrompt';

const TerminalLine = ({ line }) => {
  if (line.type === 'welcome') {
    return (
      <div className="text-[#7dd3fc] whitespace-pre-wrap break-words mb-3">
        {line.content}
      </div>
    );
  }

  if (line.type === 'command') {
    return (
      <div className="flex items-start min-h-[1.5rem]">
        <PromptPrefix />
        <span className="text-[#e8e8e8] break-all">{line.content}</span>
      </div>
    );
  }

  if (line.type === 'error') {
    return (
      <div className="text-[#f87171] whitespace-pre-wrap break-words pl-0 py-0.5">
        {line.content}
      </div>
    );
  }

  if (line.animated) {
    return (
      <div className="text-[#c8c8c8] py-0.5">
        <TypingEffect
          text={line.content}
          speed={6}
          className="whitespace-pre-wrap break-words"
        />
      </div>
    );
  }

  return (
    <div className="text-[#c8c8c8] whitespace-pre-wrap break-words py-0.5">
      {line.content}
    </div>
  );
};

export default TerminalLine;
