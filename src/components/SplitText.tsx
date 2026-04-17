import React from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  charClass?: string;
  wordClass?: string;
}

/**
 * High-performance, zero-dependency alternative to GSAP SplitText/split-type.
 * Physically dissects strings into GSAP-targetable matrix nodes, avoiding NPM registry mapping errors.
 */
const SplitText: React.FC<SplitTextProps> = ({ 
  text, 
  className = '', 
  charClass = 'split-char', 
  wordClass = 'split-word whitespace-nowrap inline-block'
}) => {
  return (
    <span className={className}>
      {text.split(' ').map((word, wordIndex) => (
        <span key={`word-${wordIndex}`} className={wordClass}>
          {word.split('').map((char, charIndex) => (
            <span 
              key={`char-${wordIndex}-${charIndex}`} 
              className={`inline-block ${charClass}`}
            >
              {char}
            </span>
          ))}
          {wordIndex < text.split(' ').length - 1 && (
            <span className={`inline-block ${charClass}`}>&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
