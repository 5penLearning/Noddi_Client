import { useEffect, useState } from 'react';

function TypewriterText({
  text,
  speed = 55,
  delay = 350,
  className = '',
  showCursor = true,
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIsComplete(true);
      return undefined;
    }

    setDisplayedText('');
    setIsComplete(false);

    let currentIndex = 0;
    let typingTimer;

    const startTimer = window.setTimeout(() => {
      typingTimer = window.setInterval(() => {
        currentIndex += 1;

        setDisplayedText(
          text.slice(0, currentIndex),
        );

        if (currentIndex >= text.length) {
          window.clearInterval(typingTimer);
          setIsComplete(true);
        }
      }, speed);
    }, delay);

    return () => {
      window.clearTimeout(startTimer);

      if (typingTimer) {
        window.clearInterval(typingTimer);
      }
    };
  }, [text, speed, delay]);

  return (
    <span className={className}>
      <span className="whitespace-pre-line">
        {displayedText}
      </span>

      {showCursor && (
        <span
          className={`ml-[3px] inline-block h-[0.92em] w-[2px] translate-y-[1px] bg-current ${isComplete
            ? 'animate-pulse'
            : ''
            }`}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

export default TypewriterText;
