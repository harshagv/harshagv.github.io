import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
    // 1. Initialize Lenis IMMEDIATELY so the absolute DOM height establishes itself
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
  }, []);

  // 2. Lock / Unlock system routing based on Boot Hook
  useEffect(() => {
    if (!booted) {
      if (lenisRef.current) lenisRef.current.stop();
      window.scrollTo(0,0);
    } else {
      if (lenisRef.current) lenisRef.current.start();
      // CRITICAL: Refresh all GSAP Pin calculations right as the Boot overlay releases the lock
      // This forces the physics engine to trace the correct coordinates instead of crashing at 0
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }
  }, [booted]);

  return (
    <div className="relative w-full bg-transparent overflow-hidden">
      <AnimatePresence>
        {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      {/* Freeze ONLY visual opacity but leave layout exact, allowing GSAP to map from ms 1 */}
      <div className={`transition-opacity duration-1000 ${booted ? 'opacity-100' : 'opacity-0'}`}>
        <Cursor />
        <Noise />

        {/* 3D Background - Fixed behind everything */}
        <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }} eventSource={document.body} eventPrefix="client">
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
