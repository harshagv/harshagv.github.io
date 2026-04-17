import React from 'react';
import { Mail } from 'lucide-react';
import MagneticButton from './MagneticButton';
import FramerSplitText from './FramerSplitText';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="py-12 border-t border-white/10 bg-black/50 backdrop-blur-md pointer-events-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">

        <div className="mb-6 md:mb-0">
          <FramerSplitText 
            text={`© ${new Date().getFullYear()} Harsha G V · Built like a hardened container image · No plaintext secrets, ever.`}
            className="font-mono text-sm"
            startDelay={200}
            stagger={0.015}
          />
        </div>

        <div className="flex items-center space-x-4">
          <MagneticButton intensity={0.5}>
            <a href="https://github.com/harshagv" target="_blank" rel="noopener noreferrer" className="block p-2 text-gray-400 transition-transform">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/github.svg" alt="GitHub" className="w-6 h-6 filter invert opacity-60 hover:opacity-100 hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all" />
            </a>
          </MagneticButton>
          <MagneticButton intensity={0.5}>
            <a href="https://twitter.com/harsha_gv" target="_blank" rel="noopener noreferrer" className="block p-2 text-gray-400 transition-transform">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/x.svg" alt="Twitter/X" className="w-6 h-6 filter invert opacity-60 hover:opacity-100 hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all" />
            </a>
          </MagneticButton>
          <MagneticButton intensity={0.5}>
            <a href="https://www.linkedin.com/in/harshagv/" target="_blank" rel="noopener noreferrer" className="block p-2 text-gray-400 transition-transform">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/linkedin.svg" alt="LinkedIn" className="w-6 h-6 filter invert opacity-60 hover:opacity-100 hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all" />
            </a>
          </MagneticButton>
          <MagneticButton intensity={0.5}>
            <a href="https://medium.com/@harshagv" target="_blank" rel="noopener noreferrer" className="block p-2 text-gray-400 transition-transform">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/medium.svg" alt="Medium" className="w-6 h-6 filter invert opacity-60 hover:opacity-100 hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all" />
            </a>
          </MagneticButton>
          <MagneticButton intensity={0.5}>
            <a href="https://www.credly.com/users/harshagv" target="_blank" rel="noopener noreferrer" className="block p-2 text-gray-400 transition-transform">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/credly.svg" alt="Credly" className="w-6 h-6 filter invert opacity-60 hover:opacity-100 hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all" />
            </a>
          </MagneticButton>
          <MagneticButton intensity={0.5}>
            <a href="mailto:harsha.gv29@gmail.com" className="block p-2 text-gray-400 hover:text-[var(--color-accent)] transition-colors mt-0.5 ml-1">
              <Mail className="w-6 h-6 opacity-60 hover:opacity-100 transition-opacity" />
            </a>
          </MagneticButton>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
