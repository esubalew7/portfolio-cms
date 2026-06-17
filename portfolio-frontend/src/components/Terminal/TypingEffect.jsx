import { useEffect, useState } from 'react';

const TypingEffect = ({
  text,
  speed = 12,
  onComplete,
  className = '',
}) => {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;

    setDisplayed('');
    setIsComplete(false);

    let index = 0;
    let rafId;

    const type = () => {
      const step = Math.max(1, Math.round(speed / 8));
      const next = Math.min(index + step, text.length);
      setDisplayed(text.substring(0, next));
      index = next;

      if (index < text.length) {
        rafId = requestAnimationFrame(type);
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    };

    rafId = requestAnimationFrame(type);
    return () => cancelAnimationFrame(rafId);
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      <span className="whitespace-pre-wrap break-words">{displayed}</span>
      {!isComplete && (
        <span
          className="inline-block w-[7px] h-[14px] bg-[#c0c0c0] align-[-2px] ml-px"
          style={{ animation: 'blink-cursor 530ms step-end infinite' }}
        />
      )}
    </span>
  );
};

export default TypingEffect;
