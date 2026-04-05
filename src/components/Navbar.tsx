import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsOpen(false); // Close mobile menu when a link is clicked
    const lenis = (window as any).lenis;
    const target = id === 'root' ? 0 : `#${id}`;

    if (lenis) {
      // Check if we are on mobile (under 768px)
      const isMobile = window.innerWidth < 768;
      
      // If mobile: offset by -80px to clear the sticky navbar. 
      // If desktop: offset by 80% of screen height to clear the GSAP pin.
      let yOffset = 0;
      if (id === 'whoami') {
        yOffset = isMobile ? -80 : window.innerHeight * 0.8;
      } else {
        yOffset = isMobile ? -80 : 0; // Good practice to clear navbar for all sections on mobile
      }

      lenis.scrollTo(target, { duration: 1.2, force: true, offset: yOffset });
    } else {
      if (id === 'root') window.scrollTo({ top: 0, behavior: 'smooth' });
      else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl z-50 pointer-events-none">
      <div className="flex items-center justify-between rounded-full bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 px-8 py-3 pointer-events-auto shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
        <a href="#root" className="text-xl font-black tracking-tighter text-white mr-12 uppercase cursor-pointer" onClick={(e) => scrollTo('root', e)}>
          <span className="text-[var(--color-accent)]">H</span>arsha.
        </a>
        <ul className="hidden md:flex items-center justify-center space-x-8 text-sm font-medium text-gray-400">
          <li><a href="#whoami" onClick={(e) => scrollTo('whoami', e)} className="hover:text-white hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all cursor-pointer">About</a></li>
          <li><a href="#work" onClick={(e) => scrollTo('work', e)} className="hover:text-white hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all cursor-pointer">Stations</a></li>
          <li><a href="#certs" onClick={(e) => scrollTo('certs', e)} className="hover:text-white hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all cursor-pointer">Certs</a></li>
          <li><a href="#contact" onClick={(e) => scrollTo('contact', e)} className="hover:text-white hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all cursor-pointer">Contact</a></li>
        </ul>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white hover:text-[var(--color-accent)] transition-colors relative z-[60]">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Popdown Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full mt-4 bg-[#0d1117]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 pointer-events-auto flex flex-col gap-6 shadow-2xl">
          <a href="#whoami" onClick={(e) => scrollTo('whoami', e)} className="text-gray-300 hover:text-white font-medium text-lg">About</a>
          <a href="#work" onClick={(e) => scrollTo('work', e)} className="text-gray-300 hover:text-white font-medium text-lg">Stations</a>
          <a href="#certs" onClick={(e) => scrollTo('certs', e)} className="text-gray-300 hover:text-white font-medium text-lg">Certs</a>
          <a href="#contact" onClick={(e) => scrollTo('contact', e)} className="text-gray-300 hover:text-white font-medium text-lg">Contact</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
