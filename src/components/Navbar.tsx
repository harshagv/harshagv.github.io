import React from 'react';
import { Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  const scrollTo = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    const lenis = (window as any).lenis;
    
    if (id === 'root') {
      if (lenis) lenis.scrollTo(0, { duration: 1.2, force: true });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (id === 'whoami') {
      const targetY = window.innerHeight; // Mathematically guaranteed 100vh offset
      if (lenis) lenis.scrollTo(targetY, { duration: 1.2, force: true });
      else window.scrollTo({ top: targetY, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      // Calculate exact absolute pixel distance from top of document
      const yOffset = el.getBoundingClientRect().top + window.scrollY;
      
      if (lenis) {
        lenis.scrollTo(yOffset, { duration: 1.2, force: true });
      } else {
        window.scrollTo({ top: yOffset, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl z-50 pointer-events-none">
      <div className="flex items-center justify-between rounded-full bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 px-8 py-3 pointer-events-auto shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
        <div className="text-xl font-black tracking-tighter text-white mr-12 uppercase cursor-pointer" onClick={() => scrollTo('root')}>
          <span className="text-[var(--color-accent)]">H</span>arsha.
        </div>
        <ul className="hidden md:flex items-center justify-center space-x-8 text-sm font-medium text-gray-400">
          <li onClick={() => scrollTo('whoami')} className="hover:text-white hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all cursor-pointer">About</li>
          <li onClick={() => scrollTo('work')} className="hover:text-white hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all cursor-pointer">Stations</li>
          <li onClick={() => scrollTo('certs')} className="hover:text-white hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all cursor-pointer">Certs</li>
          <li onClick={() => scrollTo('contact')} className="hover:text-white hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all cursor-pointer">Contact</li>
        </ul>
        <button className="md:hidden text-white hover:text-[var(--color-accent)] transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
