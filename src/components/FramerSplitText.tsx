import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface FramerSplitTextProps {
  text: string;
  className?: string;
  startDelay?: number;   // Delay after boot-complete
  stagger?: number;
}

const FramerSplitText: React.FC<FramerSplitTextProps> = ({
  text,
  className = '',
  startDelay = 800,
  stagger = 0.009,        // Smaller stagger = more visible wave
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
    visible: {
      color: ["rgba(255, 255, 255, 0.15)", "#00ff66", "#768390"], // Final base settle color
      transition: {
        duration: 0.8,
        times: [0, 0.15, 1], // Strike rapidly at 15% mark, then slowly cool off
        ease: ["easeOut", "easeInOut"],
      },
    },
  };

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
          if (segment.trim() === '') {
            return <span key={i}>&nbsp;</span>;
          }
          return (
            <span key={i} className="inline-block whitespace-pre">
              {segment.split('').map((char, j) => (
                <motion.span
                  key={`${i}-${j}`}
                  variants={charVariants}
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