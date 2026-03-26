import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

const HackerText: React.FC<{ text: string, className?: string }> = ({ text, className }) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*";
  const [displayText, setDisplayText] = useState(text);
  const hasAnimated = useRef(false);

  const animateText = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(() => 
        text.split("")
          .map((_, index) => {
            if (index < iteration) {
              return text[index];
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("")
      );
      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2; // Speed up resolution
    }, 40);
  };

  useEffect(() => {
    if (!hasAnimated.current) {
      setTimeout(animateText, 600);
      hasAnimated.current = true;
    }
  }, [text]);

  return (
    <span 
      className={className}
      onMouseEnter={animateText}
    >
      {displayText}
    </span>
  );
};

const RollingText: React.FC<{ titles: string[] }> = ({ titles }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [titles.length]);

  return (
    <div className="relative overflow-hidden h-[1.3em] inline-flex items-center align-bottom">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          initial={{ y: "120%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-120%", opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="whitespace-nowrap"
        >
          {titles[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Hero: React.FC = () => {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto w-full z-10 pointer-events-auto mt-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-4 pointer-events-none"
        >
          <motion.div variants={item} className="inline-block pointer-events-auto">
            <span className="text-[var(--color-accent)] font-mono text-lg md:text-xl tracking-wide">&gt; INIT SYSTEM...</span>
          </motion.div>
          
          <motion.h1 
            variants={item}
            className="text-5xl md:text-7xl lg:text-8xl tracking-normal text-white leading-[1.1] pointer-events-auto cursor-crosshair uppercase drop-shadow-[0_0_15px_rgba(0,255,102,0.1)]"
            style={{ fontFamily: 'Monoton, sans-serif', fontWeight: 'normal' }}
          >
            <HackerText text="Harsha G V" />
          </motion.h1>
          
          <div 
            className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#0CAFFF] pointer-events-auto drop-shadow-[0_0_10px_rgba(12,175,255,0.4)] mt-2"
            style={{ fontFamily: "'Fira Code', monospace" }}
          >
            <RollingText titles={[
              "Cybersecurity Engineer.",
              "Cloud Security Architect.",
              "Zero Trust Advocate.",
              "Agentic AI Security Researcher."
            ]} />
          </div>
          
          <motion.p
            variants={item}
            className="mt-6 text-gray-400 max-w-2xl text-lg md:text-xl font-light pointer-events-auto leading-relaxed"
          >
            Cybersecurity Engineer based in Sydney, architecting resilient defense postures and Zero Trust environments. Specialising in Cloud Security, Threat Detection, Agentic AI Security, and DevSecOps for the APAC region.
          </motion.p>
          
          <motion.div variants={item} className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 pointer-events-auto">
            <button 
              className="px-8 py-4 bg-[var(--color-accent)] text-black font-bold rounded-lg hover:bg-white focus:bg-white transition-all shadow-[0_0_20px_rgba(0,255,102,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] relative group overflow-hidden hover:-translate-y-1"
              onClick={() => {
                const el = document.getElementById('work');
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
              }}
            >
              <span className="relative z-10 font-mono uppercase tracking-widest text-sm">Explore Battle Stations</span>
            </button>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-terminal'))}
              className="px-8 py-4 bg-transparent border border-[var(--color-accent)]/40 text-white font-mono uppercase tracking-widest text-sm font-bold rounded-lg hover:bg-[var(--color-accent)]/10 transition-colors hover:-translate-y-1"
            >
              Access Terminal
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
