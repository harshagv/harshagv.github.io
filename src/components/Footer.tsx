import React, { useEffect, useRef } from 'react';
import { Mail } from 'lucide-react';
import MagneticButton from './MagneticButton';
import FramerSplitText from './FramerSplitText';
import TcpHandshake from './TcpHandshake';
import NodeClock from './NodeClock';
import sydneyHarbourscape from '../assets/sydney-harbourscape.png';

const SOCIALS = [
  { href: 'https://github.com/harshagv', icon: 'github', label: 'GitHub' },
  { href: 'https://twitter.com/harsha_gv', icon: 'x', label: 'Twitter/X' },
  { href: 'https://www.linkedin.com/in/harshagv/', icon: 'linkedin', label: 'LinkedIn' },
  { href: 'https://medium.com/@harshagv', icon: 'medium', label: 'Medium' },
  { href: 'https://www.credly.com/users/harshagv', icon: 'credly', label: 'Credly' },
];

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);

  // Scope reveal: a soft lit circle follows the pointer over the harbour.
  // Touch / no-hover devices keep it resting on the Opera House (CSS defaults).
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const footer = footerRef.current, band = bandRef.current;
    if (!footer || !band) return;
    let raf = 0, x = 0, y = 0, inside = false;
    const apply = () => {
      raf = 0;
      if (inside) {
        band.classList.add('is-tracking');
        band.style.setProperty('--mx', `${x}px`);
        band.style.setProperty('--my', `${y}px`);
      } else {
        band.classList.remove('is-tracking');
        band.style.removeProperty('--mx');
        band.style.removeProperty('--my');
      }
    };
    const onMove = (e: PointerEvent) => {
      const r = band.getBoundingClientRect();
      x = e.clientX - r.left; y = e.clientY - r.top;
      inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => { inside = false; if (!raf) raf = requestAnimationFrame(apply); };
    footer.addEventListener('pointermove', onMove);
    footer.addEventListener('pointerleave', onLeave);
    return () => {
      footer.removeEventListener('pointermove', onMove);
      footer.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <footer ref={footerRef} id="contact" className="py-16 px-4 sm:px-6 md:px-8 pointer-events-auto">
      <div className="max-w-[1290px] mx-auto">
        {/* Terminal frame */}
        <div className="relative w-full rounded-2xl md:rounded-3xl border border-[var(--color-accent)]/25 bg-[#030704] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(0,255,102,0.06)] overflow-hidden group hover:border-[var(--color-accent)]/40 transition-colors duration-500">

          {/* Harbour viewport: a fixed-ratio window cropped onto the Opera House + Harbour Bridge.
              The image's own baked-in HUD (menu + info box, top 40%) is always cropped out. */}
          <div className="relative w-full aspect-[2/1] md:aspect-[4/1] max-h-[420px] overflow-hidden select-none pointer-events-none">
            {/* Dot-matrix photo (same texture as the globe) + scope reveal */}
            <div ref={bandRef} className="harbour-band absolute inset-0">
              <div className="harbour-dots absolute inset-0">
                <div className="footer-harbour harbour-base absolute inset-0 bg-no-repeat" style={{ backgroundImage: `url("${sydneyHarbourscape}")` }} />
                <div className="footer-harbour harbour-scope absolute inset-0 bg-no-repeat" style={{ backgroundImage: `url("${sydneyHarbourscape}")` }} />
              </div>
              <div className="harbour-reticle" aria-hidden="true" />
            </div>
            {/* Soft top vignette for the HUD labels, and a long fade into the content below */}
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#030704]/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-[#030704]" />
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 102, 0.5) 1px, transparent 0)', backgroundSize: '100% 4px' }}
            />
            {/* HUD */}
            <div className="absolute inset-x-0 top-0 max-w-[1290px] mx-auto px-6 sm:px-10 lg:px-14 pt-5 md:pt-6 flex items-start justify-between font-mono [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] md:text-[11px] tracking-[0.18em] text-[var(--color-accent)]">SYDNEY_NODE</span>
                <span className="text-[10px] tracking-[0.12em] text-[#8fa89a]">33.8568°S 151.2153°E</span>
              </div>
              <NodeClock />
            </div>
          </div>
          {/* Top edge glow, sweep and frame corners */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)]/50 to-transparent pointer-events-none" />
          <div className="footer-sweep" aria-hidden="true" />
          <span className="absolute top-3 left-3.5 z-20 font-mono text-[11px] text-[var(--color-accent)]/40 select-none pointer-events-none font-bold">┌</span>
          <span className="absolute top-3 right-3.5 z-20 font-mono text-[11px] text-[var(--color-accent)]/40 select-none pointer-events-none font-bold">┐</span>
          <span className="absolute bottom-3 left-3.5 z-20 font-mono text-[11px] text-[var(--color-accent)]/40 select-none pointer-events-none font-bold">└</span>
          <span className="absolute bottom-3 right-3.5 z-20 font-mono text-[11px] text-[var(--color-accent)]/40 select-none pointer-events-none font-bold">┘</span>

          {/* Footer text + socials */}
          <div className="relative z-10 max-w-[1290px] mx-auto -mt-1 md:-mt-3 px-6 sm:px-10 lg:px-14 pb-5 md:pb-3 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="flex-1 min-w-0 text-center md:text-left">
              <FramerSplitText
                text={`© ${new Date().getFullYear()} Harsha G V · Built like a hardened container image · No plaintext secrets, ever.`}
                className="font-mono text-sm md:text-[15px] leading-relaxed"
                startDelay={200}
                stagger={0.015}
                settleColor="#8fa89a"
                accents={[
                  { match: 'Harsha G V', color: '#eafff1' },
                  { match: '·', color: 'rgba(0, 255, 102, 0.45)' },
                  { match: 'hardened container image', color: '#eafff1' },
                  { match: 'No plaintext secrets, ever.', color: '#00ff66' },
                ]}
              />
            </div>

            <div className="shrink-0 md:pl-12 md:border-l md:border-[var(--color-accent)]/15">
              <div className="social-bus relative flex items-center gap-1 sm:gap-2">
              {SOCIALS.map((s) => (
                <MagneticButton key={s.icon} intensity={0.5}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="block p-2 transition-transform">
                    <img src={`https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/${s.icon}.svg`} alt="" className="footer-icon w-6 h-6" />
                  </a>
                </MagneticButton>
              ))}
              <MagneticButton intensity={0.5}>
                <a href="mailto:harsha.gv29@gmail.com" aria-label="Email" className="block p-2 text-[#bfffd6]/75 hover:text-[var(--color-accent)] hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all mt-0.5 ml-1">
                  <Mail className="w-6 h-6" />
                </a>
              </MagneticButton>
              </div>
            </div>
          </div>

          {/* Handshake status strip */}
          <div className="relative z-10 max-w-[1290px] mx-auto px-6 sm:px-10 lg:px-14"><div className="border-t border-[var(--color-accent)]/15 py-5 flex justify-center">
            <TcpHandshake />
          </div></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
