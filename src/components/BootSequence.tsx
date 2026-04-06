import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [bootText, setBootText] = useState('');
  const [spinnerStep, setSpinnerStep] = useState(0);

  // Original boot text animation (character-by-character)
  useEffect(() => {
    const fullText = '> INIT SYSTEM...\n> SYSTEM ONLINE.\n> ACCESS GRANTED.\n';
    let i = 0;
    const interval = setInterval(() => {
      setBootText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('boot-complete'));
          onComplete();
        }, 900);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  // H-Shaped Spinner Animation - Exact sequence you requested
  useEffect(() => {
    const spinnerInterval = setInterval(() => {
      setSpinnerStep((prev) => (prev + 1) % 9); // 9 stages for precise control
    }, 280);

    return () => clearInterval(spinnerInterval);
  }, []);

  const renderHSpinner = () => {
    // Dot lighting thresholds (0 = top-left, 2 = top-right, etc.)
    const isLit = (dot: number) => {
      if (dot === 0) return spinnerStep >= 1; // left vertical top
      if (dot === 3) return spinnerStep >= 2; // left vertical middle
      if (dot === 6) return spinnerStep >= 3; // left vertical bottom
      if (dot === 4) return spinnerStep >= 4; // horizontal center
      if (dot === 5) return spinnerStep >= 5; // horizontal right
      if (dot === 2) return spinnerStep >= 6; // right vertical top
      if (dot === 8) return spinnerStep >= 7; // right vertical bottom
      return false;
    };

    return (
      <div className="grid grid-cols-3 gap-1.5 mb-12">
        {/* Row 1 */}
        <div className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${isLit(0) ? 'bg-white scale-100' : 'bg-transparent scale-0'}`} />
        <div className="w-3.5 h-3.5 bg-transparent" />
        <div className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${isLit(2) ? 'bg-white scale-100' : 'bg-transparent scale-0'}`} />

        {/* Row 2 - Horizontal Bar */}
        <div className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${isLit(3) ? 'bg-white scale-100' : 'bg-transparent scale-0'}`} />
        <div className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${isLit(4) ? 'bg-white scale-100' : 'bg-transparent scale-0'}`} />
        <div className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${isLit(5) ? 'bg-white scale-100' : 'bg-transparent scale-0'}`} />

        {/* Row 3 */}
        <div className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${isLit(6) ? 'bg-white scale-100' : 'bg-transparent scale-0'}`} />
        <div className="w-3.5 h-3.5 bg-transparent" />
        <div className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${isLit(8) ? 'bg-white scale-100' : 'bg-transparent scale-0'}`} />
      </div>
    );
  };

  // Split typed text into lines so we can color them individually while keeping original typing effect
  const typedLines = bootText.split('\n');

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center p-8 pointer-events-auto"
    >
      {/* H Spinner - centered above text */}
      {renderHSpinner()}

      {/* Boot Text - original character-by-character animation + left indent */}
      <div className="font-mono text-lg md:text-2xl whitespace-pre-wrap max-w-2xl w-full leading-relaxed drop-shadow-[0_0_15px_rgba(0,255,102,0.4)] pl-8 text-left">
        {/* Line 1 - Hot Lemon */}
        {typedLines[0] && <span className="text-[#f5ff00] block">{typedLines[0]}</span>}

        {/* Line 2 - Hot Lemon */}
        {typedLines[1] && <span className="text-[#f5ff00] block">{typedLines[1]}</span>}

        {/* Line 3 - Accent color */}
        {typedLines[2] && <span className="text-[var(--color-accent)] block">{typedLines[2]}</span>}

        {/* Cursor - always visible at the end */}
        <span className="inline-block w-3 h-5 md:h-6 bg-[var(--color-accent)] animate-pulse ml-1 align-middle" />
      </div>
    </motion.div>
  );
};

export default BootSequence;