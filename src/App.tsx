import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Lenis from 'lenis';
import { gsap } from 'gsap';
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

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [booted, setBooted] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    (window as any).lenis = lenis; // Expose globally for Navbar routing

    // ✅ THE BRIDGE — without this, GSAP and Lenis are blind to each other
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenisRef.current = null;
    };
  }, []);

  // 2. Lock / Unlock system routing based on Boot Hook
  useEffect(() => {
    if (!booted) {
      if (lenisRef.current) lenisRef.current.stop();
      window.scrollTo(0, 0);
    } else {
      if (lenisRef.current) lenisRef.current.start();
      // CRITICAL: Refresh GSAP calculations AFTER the 1000ms opacity fade is fully complete.
      // Reflowing the DOM mid-transition causes heavy GPU flicker on mobile devices.
      setTimeout(() => ScrollTrigger.refresh(), 1200);
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

        {/* CSS LAYER (Z: -2) -> HARDWARE_SECURITY: LOGIC_TRACE at absolute bottom */}
        <div 
          className="fixed inset-0 w-full h-full z-[-2] pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(0, 255, 102, 0.06) 1.5px, transparent 0),
              linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 0),
              linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 0)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* WEBGL LAYER (Z: -1) -> 3D WebGL Orbiting Star-field and Astrolabe over the top */}
        <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none">
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 45 }} eventSource={document.body} eventPrefix="client">
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
