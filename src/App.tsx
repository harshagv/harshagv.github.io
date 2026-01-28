import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Scene from './components/Scene';

function App() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize smooth scrolling wrapper
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  return (
    <div className="relative w-full min-h-[200vh] bg-transparent">
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
          
          {/* Mock spacer content to show scrolling */}
          <section className="min-h-screen flex items-center justify-center px-6 pointer-events-none">
            <div className="max-w-4xl mx-auto p-10 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl pointer-events-auto">
              <h2 className="text-4xl font-bold mb-6 text-[var(--color-accent-cyan)]">Keep Scrolling</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                The content here naturally scrolls over the fixed WebGL canvas in the background. 
                Because the HTML overlay is structured carefully with CSS pointer-events, your mouse interactions 
                continue to affect the 3D 'Cryptographic Core' through the transparent areas of the site.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
