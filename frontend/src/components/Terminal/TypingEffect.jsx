import { memo } from 'react';

const TypingEffect = memo(({ text, className = '' }) => {
  return (
    <span className={className}>
      <span className="whitespace-pre-wrap break-words">{text}</span>
    </span>
  );
});

TypingEffect.displayName = 'TypingEffect';

export default TypingEffect;
