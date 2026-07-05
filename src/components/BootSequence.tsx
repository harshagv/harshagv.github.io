import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [bootText, setBootText] = useState('> INIT SYSTEM');
  const [spinnerStep, setSpinnerStep] = useState(-1);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [spinnerStarted, setSpinnerStarted] = useState(false);

  // Original typing animation
  useEffect(() => {
    let isCancelled = false;

    const runSequence = async () => {
      const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      // Wait for fonts and scene-ready event (with a 3s max timeout fallback)
      await Promise.race([
        Promise.all([
          document.fonts.ready,
          new Promise(resolve => {
            const onReady = () => {
              window.removeEventListener('scene-ready', onReady);
              resolve(true);
            };
            if ((window as any)._sceneReady) {
              resolve(true);
            } else {
              window.addEventListener('scene-ready', onReady);
            }
          })
        ]),
        wait(3000)
      ]);

      if (isCancelled) return;
      setBootText('> INIT SYSTEM.');
      await wait(300);

      if (isCancelled) return;
      setBootText('> INIT SYSTEM..');
      await wait(300);

      if (isCancelled) return;
      setBootText('> INIT SYSTEM...');
      await wait(300);

      const remainingText = '\n> SYSTEM ONLINE\n> ACCESS GRANTED\n';
      let currentText = '> INIT SYSTEM...';

      // Rapid typewriter effect for the final readout
      for (let i = 0; i < remainingText.length; i++) {
        if (isCancelled) return;
        currentText += remainingText[i];
        setBootText(currentText);
        await wait(25); // Faster typing
      }

      if (isCancelled) return;
      setIsTypingComplete(true);

      // Brief buffer to let the CRT scanline complete
      await wait(800);

      if (isCancelled) return;
      window.dispatchEvent(new CustomEvent('boot-complete'));
      onComplete();
    };

    runSequence();

    return () => { isCancelled = true; };
  }, [onComplete]);

  // Spinner Animation
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSpinnerStarted(true);
      setSpinnerStep(0);
    }, 200); // Start tracer loop early
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!spinnerStarted) return;
    const interval = setInterval(() => {
      setSpinnerStep((prev) => (prev + 1) % 10);
    }, 200);
    return () => clearInterval(interval);
  }, [spinnerStarted]);

  const renderHSpinner = () => {
    const activeDots = [0, 3, 6, 4, 5, 2, 8];

    return (
      <div className="grid grid-cols-3 gap-4 md:gap-5"> {/* Increased gap proportionally for larger shape */}
        {Array.from({ length: 9 }).map((_, index) => {
          // Empty grid spaces
          if (index === 1 || index === 7) return <div key={index} className="w-5 h-5 md:w-6 md:h-6" />;

          const order = activeDots.indexOf(index);
          const isActive = spinnerStarted && spinnerStep > order;

          return (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: order * 0.1, duration: 0.3, ease: "easeOut" }}
              className={`w-5 h-5 md:w-6 md:h-6 rounded-full transition-all duration-300 ${isActive
                ? 'bg-white scale-100 opacity-100 shadow-[0_0_12px_#ffffff]'
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
      {/* Spinner Area */}
      <div className="flex-1 flex items-center justify-center min-h-[180px]">
        {renderHSpinner()}
      </div>

      {/* Terminal Text Container */}
      <div
        className="w-full max-w-2xl text-lg md:text-2xl leading-relaxed pl-8 text-left h-[160px]"
        style={{
          fontFamily: 'var(--font-fira), monospace',
          fontVariantLigatures: 'none',
          fontFeatureSettings: '"kern" 0',
          letterSpacing: '0px',
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'pre',
          textAlign: 'left'
        }}
      >
        <div className="flex flex-col items-start">
          {previousLines.map((line, idx) => (
            <span
              key={idx}
              className={`block h-[1.5em] ${idx < 1 ? 'text-[#f5ff00]' : 'text-[var(--color-accent)]'}`}
            >
              {line}
            </span>
          ))}

          {/* Combined Text and Cursor for unified color and zero-jitter alignment */}
          <div
            className={`flex items-center ${lines.length > 1 ? 'text-[var(--color-accent)]' : 'text-[#f5ff00]'}`}
          >
            <span>{currentLine}</span>

            {!isTypingComplete && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  // This creates the "step" effect by holding the 
                  // first value for 50% of the time and the second for 50%
                  times: [0, 0.5],
                  ease: "linear"
                }}
                className="w-[1ch] h-[1.1em] ml-[2px]"
                style={{ backgroundColor: 'currentColor', display: 'inline-block' }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Aesthetic Footer */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </motion.div>
  );
};

export default BootSequence;