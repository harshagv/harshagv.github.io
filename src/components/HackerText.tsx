import React, { useState, useEffect, useRef } from 'react';

interface HackerTextProps {
  text: string;
  className?: string;
  mode?: 'scramble' | 'decrypt';
  triggerOnBoot?: boolean;
}

const HackerText: React.FC<HackerTextProps> = ({ 
  text, 
  className = '', 
  mode = 'scramble', 
  triggerOnBoot = false 
}) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*";
  
  const [booted, setBooted] = useState(!triggerOnBoot);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [displayText, setDisplayText] = useState(triggerOnBoot ? '' : text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrambleString = (t: string) => t.split("").map((char) => char === ' ' ? ' ' : letters[Math.floor(Math.random() * letters.length)]).join("");

  const animateScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!booted) return;

    setDisplayText(scrambleString(text));

    let iteration = 0;
    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text.split("").map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iteration) return text[index];
          return letters[Math.floor(Math.random() * letters.length)];
        }).join("")
      );
      if (iteration >= text.length) {
        clearInterval(intervalRef.current!);
      }
      iteration += 1 / 2; // Sweep left to right
    }, 40);
  };

  const animateDecrypt = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsDecrypting(true);
    setDisplayText(scrambleString(text));

    const lockedIndices = new Set<number>();
    
    intervalRef.current = setInterval(() => {
      const unlocked = Array.from({length: text.length}, (_, i) => i).filter(i => !lockedIndices.has(i) && text[i] !== ' ');
      
      if (unlocked.length > 0) {
         // Lock a random index
         const randIndex = unlocked[Math.floor(Math.random() * unlocked.length)];
         lockedIndices.add(randIndex);
      }

      setDisplayText(() =>
        text.split("").map((char, index) => {
          if (char === ' ') return ' ';
          if (lockedIndices.has(index)) return text[index];
          return letters[Math.floor(Math.random() * letters.length)];
        }).join("")
      );

      if (lockedIndices.size >= text.replace(/ /g, '').length) {
        clearInterval(intervalRef.current!);
        // Add a slight delay before shifting color back
        setTimeout(() => setIsDecrypting(false), 300);
      }
    }, 80); // Slower tick for a deliberate credential unlock feel
  };

  useEffect(() => {
    if (!triggerOnBoot) return;
    
    let bootTimeout: ReturnType<typeof setTimeout>;

    const handleBootComplete = () => {
      setBooted(true);
      bootTimeout = setTimeout(mode === 'decrypt' ? animateDecrypt : animateScramble, 300);
    };

    window.addEventListener('boot-complete', handleBootComplete);

    // Fallback
    bootTimeout = setTimeout(() => {
      setBooted(true);
      if (mode === 'decrypt') animateDecrypt();
      else animateScramble();
    }, 1500);

    return () => {
      window.removeEventListener('boot-complete', handleBootComplete);
      clearTimeout(bootTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [triggerOnBoot, mode]); 

  return (
    <span
      className={`${className} transition-colors duration-500 ${isDecrypting ? 'text-[var(--color-accent)]' : ''} ${triggerOnBoot && !booted ? 'opacity-0' : 'opacity-100'}`}
      onMouseEnter={animateScramble}
    >
      {triggerOnBoot && !booted ? '' : displayText}
    </span>
  );
};

export default HackerText;
