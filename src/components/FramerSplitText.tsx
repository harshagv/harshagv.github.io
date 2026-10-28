import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface FramerSplitTextProps {
  text: string;
  className?: string;
  startDelay?: number;   // Delay after boot-complete
  stagger?: number;
  settleColor?: string;  // Final colour each character cools to
  accents?: { match: string; color: string }[]; // Phrases that settle to their own colour (every occurrence)
}

const FramerSplitText: React.FC<FramerSplitTextProps> = ({
  text,
  className = '',
  startDelay = 800,
  stagger = 0.009,        // Smaller stagger = more visible wave
  settleColor = '#768390',
  accents,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  const [animateNow, setAnimateNow] = useState(false);

  useEffect(() => {
    const handleBootComplete = () => {
      setTimeout(() => {
        setAnimateNow(true);
      }, startDelay);
    };

    window.addEventListener('boot-complete', handleBootComplete);

    // Fallback if event doesn't fire
    const fallback = setTimeout(() => setAnimateNow(true), 2500);

    return () => {
      window.removeEventListener('boot-complete', handleBootComplete);
      clearTimeout(fallback);
    };
  }, [startDelay]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6, // Step 1: Fade whole paragraph in dimly
        staggerChildren: stagger,
        delayChildren: 0.5, // Step 2: Trigger character wave explicitly after fade
      },
    },
  };

  const charVariants: Variants = {
    hidden: {
      color: "rgba(255, 255, 255, 0.15)", // Step 1 Base: Very faint light gray
    },
    visible: (finalColor: string) => ({
      color: ["rgba(255, 255, 255, 0.15)", "#00ff66", finalColor], // Final base settle color
      transition: {
        duration: 0.8,
        times: [0, 0.15, 1], // Strike rapidly at 15% mark, then slowly cool off
        ease: ["easeOut", "easeInOut"],
      },
    }),
  };

  // Per-character settle colour (default + accent phrases)
  const charColors: string[] = new Array(text.length).fill(settleColor);
  accents?.forEach(({ match, color }) => {
    if (!match) return;
    let at = text.indexOf(match);
    while (at !== -1) {
      charColors.fill(color, at, at + match.length);
      at = text.indexOf(match, at + match.length);
    }
  });
  let offset = 0;

  return (
    <div
      ref={containerRef}
      style={{ perspective: '800px' }}
      className={`${className}`}
    >
      <span className="sr-only">{text}</span>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={animateNow && isInView ? "visible" : "hidden"}
        aria-hidden="true"
      >
        {text.split(/(\s+)/).map((segment, i) => {
          const start = offset;
          offset += segment.length;
          if (segment.trim() === '') {
            return <span key={i}>&nbsp;</span>;
          }
          return (
            <span key={i} className="inline-block whitespace-pre">
              {segment.split('').map((char, j) => (
                <motion.span
                  key={`${i}-${j}`}
                  variants={charVariants}
                  custom={charColors[start + j]}
                  className="inline-block origin-bottom"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
};

export default FramerSplitText;