import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const Hero: React.FC = () => {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
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
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-[1.1] pointer-events-auto"
          >
            Hi, I'm Harsha.
          </motion.h1>
          <motion.h2
            variants={item}
            className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-400 mt-2 pointer-events-auto"
          >
            Cybersecurity Engineer.
          </motion.h2>
          <motion.p
            variants={item}
            className="mt-6 text-gray-400 max-w-2xl text-lg md:text-xl font-light pointer-events-auto"
          >
            Securing digital landscapes through advanced threat modeling, robust encryption, and proactive defense strategies. Building architectures that remain uncompromised.
          </motion.p>
          
          <motion.div variants={item} className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 pointer-events-auto">
            <button className="px-8 py-4 bg-[var(--color-accent)] text-black font-bold rounded-lg hover:bg-white focus:bg-white transition-colors relative group overflow-hidden">
              <span className="relative z-10">Deploy Defenses</span>
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full skew-x-12 group-hover:translate-x-full transition-transform duration-500"></div>
            </button>
            <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-lg hover:bg-white/5 transition-colors">
              Explore Network
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
