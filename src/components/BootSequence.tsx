import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  // 1. Start with just the base text, no dots or newlines yet
  const [text, setText] = useState('> INIT SYSTEM');

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      // 2. Typewriter effect for the three dots on the same line
      if (step === 0) {
        setText('> INIT SYSTEM.');
      } else if (step === 1) {
        setText('> INIT SYSTEM..');
      } else if (step === 2) {
        setText('> INIT SYSTEM...');
      }
      // 3. Append the final lines after the dots finish
      else if (step === 3) {
        setText('> INIT SYSTEM...\n> SYSTEM ONLINE.\n> ACCESS GRANTED.\n');
      }
      // 4. Finish sequence
      else if (step === 4) {
        clearInterval(interval);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('boot-complete'));
          onComplete();
        }, 800);
      }
      step++;
    }, 400); // Slightly faster interval (400ms) looks better for typewriter dots

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center p-8 pointer-events-auto"
    >
      <div className="font-mono text-[var(--color-accent)] text-lg md:text-2xl whitespace-pre-wrap max-w-2xl w-full leading-relaxed drop-shadow-[0_0_15px_rgba(0,255,102,0.4)]">
        {text}
        <span className="inline-block w-3 h-5 md:h-6 bg-[var(--color-accent)] animate-pulse ml-2 align-middle" />
      </div>
    </motion.div>
  );
};

export default BootSequence;