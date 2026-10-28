import React from 'react';
import { Mail } from 'lucide-react';
import MagneticButton from './MagneticButton';
import FramerSplitText from './FramerSplitText';
import TcpHandshake from './TcpHandshake';
import sydneyHarbourscape from '../assets/sydney-harbourscape.png';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="py-16 px-4 sm:px-6 md:px-8 pointer-events-auto">
      <div className="max-w-[1290px] mx-auto">
        {/* Terminal Card Frame containing Sydney Harbourscape background behind footer text */}
        <div className="relative w-full rounded-2xl md:rounded-3xl border border-[var(--color-accent)]/25 bg-[#030704]/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(0,255,102,0.06)] overflow-hidden group hover:border-[var(--color-accent)]/40 transition-colors duration-500">

          {/* Neon Terminal Sydney Harbourscape Background Art */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            <div
              className="footer-harbour absolute inset-0 w-full h-full bg-no-repeat opacity-75 group-hover:opacity-90 transition-opacity duration-700"
              style={{ backgroundImage: `url("${sydneyHarbourscape}")` }}
            />
            {/* Readability overlays: dark behind the text (left), clear on the right where the Opera House + Bridge sit */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030704]/80 via-[#030704]/25 to-[#030704]/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030704]/90 via-[#030704]/45 to-[#030704]/15" />
            {/* Subtle cyber scanlines */}
            <div
              className="absolute inset-0 opacity-[0.035] pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(rgba(0, 255, 102, 0.4) 1px, transparent 0)',
                backgroundSize: '100% 4px',
              }}
            />
          </div>

          {/* Cyber Terminal Frame Corner Brackets & Top Edge Glow */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)]/50 to-transparent pointer-events-none" />
          <div className="footer-sweep" aria-hidden="true" />
          <span className="absolute top-3 left-3.5 font-mono text-[11px] text-[var(--color-accent)]/40 select-none pointer-events-none font-bold">┌</span>
          <span className="absolute top-3 right-3.5 font-mono text-[11px] text-[var(--color-accent)]/40 select-none pointer-events-none font-bold">┐</span>
          <span className="absolute bottom-3 left-3.5 font-mono text-[11px] text-[var(--color-accent)]/40 select-none pointer-events-none font-bold">└</span>
          <span className="absolute bottom-3 right-3.5 font-mono text-[11px] text-[var(--color-accent)]/40 select-none pointer-events-none font-bold">┘</span>

          {/* Foreground Footer Text & Actions */}
          <div className="relative z-10 px-6 sm:px-10 lg:px-14 pt-10 pb-8 md:pt-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="flex-1 min-w-0 text-center md:text-left">
              <FramerSplitText
                text={`© ${new Date().getFullYear()} Harsha G V · Built like a hardened container image · No plaintext secrets, ever.`}
                className="font-mono text-sm md:text-[15px] leading-relaxed [text-shadow:0_1px_10px_rgba(0,0,0,0.95)]"
                startDelay={200}
                stagger={0.015}
                settleColor="#8fa89a"
                accents={[
                  { match: 'Harsha G V', color: '#eafff1' },
                  { match: '·', color: 'rgba(0, 255, 102, 0.45)' },
                  { match: 'hardened container image', color: '#4fe3c1' },
                  { match: 'No plaintext secrets, ever.', color: '#00ff66' },
                ]}
              />
            </div>

            <div className="shrink-0 flex items-center gap-1 sm:gap-2 md:pl-12 md:border-l md:border-[var(--color-accent)]/15">
              <MagneticButton intensity={0.5}>
                <a href="https://github.com/harshagv" target="_blank" rel="noopener noreferrer" className="block p-2 text-gray-400 transition-transform">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/github.svg" alt="GitHub" className="footer-icon w-6 h-6" />
                </a>
              </MagneticButton>
              <MagneticButton intensity={0.5}>
                <a href="https://twitter.com/harsha_gv" target="_blank" rel="noopener noreferrer" className="block p-2 text-gray-400 transition-transform">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/x.svg" alt="Twitter/X" className="footer-icon w-6 h-6" />
                </a>
              </MagneticButton>
              <MagneticButton intensity={0.5}>
                <a href="https://www.linkedin.com/in/harshagv/" target="_blank" rel="noopener noreferrer" className="block p-2 text-gray-400 transition-transform">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/linkedin.svg" alt="LinkedIn" className="footer-icon w-6 h-6" />
                </a>
              </MagneticButton>
              <MagneticButton intensity={0.5}>
                <a href="https://medium.com/@harshagv" target="_blank" rel="noopener noreferrer" className="block p-2 text-gray-400 transition-transform">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/medium.svg" alt="Medium" className="footer-icon w-6 h-6" />
                </a>
              </MagneticButton>
              <MagneticButton intensity={0.5}>
                <a href="https://www.credly.com/users/harshagv" target="_blank" rel="noopener noreferrer" className="block p-2 text-gray-400 transition-transform">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/credly.svg" alt="Credly" className="footer-icon w-6 h-6" />
                </a>
              </MagneticButton>
              <MagneticButton intensity={0.5}>
                <a href="mailto:harsha.gv29@gmail.com" className="block p-2 text-[#bfffd6]/70 hover:text-[var(--color-accent)] hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all mt-0.5 ml-1">
                  <Mail className="w-6 h-6" />
                </a>
              </MagneticButton>
            </div>
          </div>

          {/* Handshake status strip — centred across the card */}
          <div className="relative z-10 mx-6 sm:mx-10 lg:mx-14 border-t border-[var(--color-accent)]/15 py-5 flex justify-center bg-[radial-gradient(ellipse_at_center,rgba(3,7,4,0.75),transparent_70%)]">
            <TcpHandshake />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
