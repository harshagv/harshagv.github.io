import React from 'react';
import { Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  const scrollTo = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const lenis = (window as any).lenis;
    const target = id === 'root' ? 0 : `#${id}`;

    if (lenis) {
      lenis.scrollTo(target, { duration: 1.2, force: true });
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
        <button className="md:hidden text-white hover:text-[var(--color-accent)] transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
