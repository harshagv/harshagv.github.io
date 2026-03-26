import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Scene from './components/Scene';
import About from './components/About';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import Noise from './components/Noise';
import FloatingTerminal from './components/FloatingTerminal';
import BootSequence from './components/BootSequence';
import ScrollKinetics from './components/ScrollKinetics';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [booted, setBooted] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // DO NOT INITIATE ENGINE UNTIL BOOT FINISHES
    if (!booted) return;

    // Initialize smooth scrolling wrapper
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    (window as any).lenis = lenisRef.current; // Expose globally for Navbar routing

    let rafId: number;

    function raf(time: number) {
      if (lenisRef.current) {
        lenisRef.current.raf(time);
        rafId = requestAnimationFrame(raf);
      }
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [booted]);

  return (
    <div className="relative w-full bg-transparent overflow-hidden">
      <AnimatePresence>
        {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      {/* Freeze ALL interactive rendering until Boot sequence finishes clearing */}
      <div className={`transition-opacity duration-1000 ${booted ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        <Cursor />
        <Noise />

        {/* 3D Background - Fixed behind everything */}
        <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-auto">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <Scene />
          </Canvas>
        </div>

        {/* DOM Foreground Content */}
        <div className="relative z-10 w-full pointer-events-none">
          <Navbar />
          <main>
            <Hero />
            <About />
            <Experience />
            <ScrollKinetics />
            <Certifications />
          </main>
          <Footer />
          <FloatingTerminal />
        </div>

      </div>
    </div>
  );
}

export default App;
