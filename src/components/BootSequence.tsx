import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [bootText, setBootText] = useState('');
  const [spinnerStep, setSpinnerStep] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Original typing animation
  useEffect(() => {
    const fullText = '> INIT SYSTEM...\n> SYSTEM ONLINE.\n> ACCESS GRANTED.\n';
    let i = 0;

    const interval = setInterval(() => {
      setBootText(fullText.slice(0, i));
      i++;

      if (i > fullText.length) {
        clearInterval(interval);
        setIsTypingComplete(true);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('boot-complete'));
          onComplete();
        }, 900);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Spinner Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSpinnerStep((prev) => (prev + 1) % 10);
    }, 260);
    return () => clearInterval(interval);
  }, []);

  const renderHSpinner = () => {
    const activeDots = [0, 3, 6, 4, 5, 2, 8];

    return (
      <div className="grid grid-cols-3 gap-2.5"> {/* Slightly reduced gap for smaller dots */}
        {Array.from({ length: 9 }).map((_, index) => {
          if (index === 1 || index === 7) return <div key={index} className="w-3 h-3" />;

          const order = activeDots.indexOf(index);
          const isActive = spinnerStep > order;

          return (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${isActive
                ? 'bg-white scale-100 opacity-100 shadow-[0_0_8px_#ffffff]'
                : 'bg-white/20 scale-100 opacity-40'
                }`}
            />
          );
        })}
      </div>
    );
  };

  const lines = bootText.split('\n');
  const currentLine = lines[lines.length - 1] || '';
  const previousLines = lines.slice(0, -1);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center p-8 pointer-events-auto"
    >
      {/* Spinner Area - Position stays locked */}
      <div className="flex-1 flex items-center justify-center min-h-[180px]">
        {renderHSpinner()}
      </div>

      {/* Terminal Text - SURGICAL EDIT HERE */}
      <div className="w-full max-w-2xl font-mono text-lg md:text-2xl leading-relaxed pl-8 text-left h-[120px] md:h-[160px]">
        {previousLines.map((line, idx) => (
          <span
            key={idx}
            // Line 0 & 1: Yellow (#f5ff00), Line 2: Accent color
            className={`block ${idx < 2 ? 'text-[#f5ff00]' : 'text-[var(--color-accent)]'}`}
          >
            {line}
          </span>
        ))}

        {/* Current line with cursor */}
        <span className={`${lines.length > 2 ? 'text-[var(--color-accent)]' : 'text-[#f5ff00]'}`}>
          {currentLine}
          {!isTypingComplete && (
            <span className="inline-block w-3 h-5 bg-[var(--color-accent)] animate-pulse ml-1 align-middle" />
          )}
        </span>
      </div>

      {/* Subtle aesthetic line */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </motion.div>
  );
};

export default BootSequence;