import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import MagneticButton from './MagneticButton';
import SessionKey from './SessionKey';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Highlight the section in view (announced by motion/scrollPolish.ts).
  useEffect(() => {
    const onActive = (e: Event) => setActive((e as CustomEvent<string | null>).detail);
    window.addEventListener('section-active', onActive);
    return () => window.removeEventListener('section-active', onActive);
  }, []);

  const mobileLinkClass = (id: string) =>
    `font-medium text-lg flex items-center gap-3 transition-colors ${
      active === id ? 'text-white' : 'text-gray-300 hover:text-white'}`;

  const linkClass = (id: string) =>
    `nav-link px-2 py-1 transition-all cursor-pointer block hover:text-white hover:drop-shadow-[0_0_8px_var(--color-accent)] ${
      active === id ? 'is-active text-white drop-shadow-[0_0_8px_var(--color-accent)]' : ''}`;

  // Find the scrollTo function and update the yOffset logic
  const scrollTo = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('session-rekey'));
    const lenis = (window as any).lenis;
    const target = id === 'root' ? 0 : `#${id}`;

    if (lenis) {
      // FIX: Only apply the 80% offset if the screen is desktop width (>= 768px)
      // and the target is 'whoami'. Otherwise, use a standard small offset.
      const isMobile = window.innerWidth < 768;
      const yOffset = (id === 'whoami' && !isMobile) ? window.innerHeight * 0.8 : 0;

      lenis.scrollTo(target, {
        duration: 1.2,
        force: true,
        offset: yOffset
      });
    } else {
      // Fallback logic remains same
      if (id === 'root') window.scrollTo({ top: 0, behavior: 'smooth' });
      else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl z-50 pointer-events-none">
      <div className="flex items-center justify-between rounded-full bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 px-8 py-3 pointer-events-auto shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-all duration-300 relative">
        {/* Page-progress hairline — scaled by --page-progress, set from ScrollTrigger (no re-renders) */}
        <span aria-hidden="true" className="nav-progress" />
        <MagneticButton intensity={0.4}>
          <a href="#root" className="text-xl font-black tracking-tighter text-white mr-8 uppercase cursor-pointer" onClick={(e) => scrollTo('root', e)}>
            <span className="text-[var(--color-accent)]">H</span>arsha.
          </a>
        </MagneticButton>
        <div className="hidden md:flex items-center">
        <ul className="flex items-center justify-center space-x-4 text-sm font-medium text-gray-400">
          <li>
            <MagneticButton intensity={0.3}>
              <a href="#whoami" onClick={(e) => scrollTo('whoami', e)} className={linkClass('whoami')} aria-current={active === 'whoami' ? 'location' : undefined}>About</a>
            </MagneticButton>
          </li>
          <li>
            <MagneticButton intensity={0.3}>
              <a href="#work" onClick={(e) => scrollTo('work', e)} className={linkClass('work')} aria-current={active === 'work' ? 'location' : undefined}>Stations</a>
            </MagneticButton>
          </li>
          <li>
            <MagneticButton intensity={0.3}>
              <a href="#certs" onClick={(e) => scrollTo('certs', e)} className={linkClass('certs')} aria-current={active === 'certs' ? 'location' : undefined}>Certs</a>
            </MagneticButton>
          </li>
          <li>
            <MagneticButton intensity={0.3}>
              <a href="#contact" onClick={(e) => scrollTo('contact', e)} className={linkClass('contact')} aria-current={active === 'contact' ? 'location' : undefined}>Contact</a>
            </MagneticButton>
          </li>
        </ul>
          <span className="ml-6 pl-6 border-l border-white/10 flex items-center">
            <SessionKey />
          </span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white hover:text-[var(--color-accent)] transition-colors relative z-[60]">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Popdown Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full mt-4 bg-[#0d1117]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 pointer-events-auto flex flex-col gap-6 shadow-2xl">
          <a href="#whoami" onClick={(e) => scrollTo('whoami', e)} className={mobileLinkClass('whoami')} aria-current={active === 'whoami' ? 'location' : undefined}>About</a>
          <a href="#work" onClick={(e) => scrollTo('work', e)} className={mobileLinkClass('work')} aria-current={active === 'work' ? 'location' : undefined}>Stations</a>
          <a href="#certs" onClick={(e) => scrollTo('certs', e)} className={mobileLinkClass('certs')} aria-current={active === 'certs' ? 'location' : undefined}>Certs</a>
          <a href="#contact" onClick={(e) => scrollTo('contact', e)} className={mobileLinkClass('contact')} aria-current={active === 'contact' ? 'location' : undefined}>Contact</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
