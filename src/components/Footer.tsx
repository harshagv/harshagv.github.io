import React from 'react';
import { Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="py-12 border-t border-white/10 bg-black/50 backdrop-blur-md pointer-events-auto mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        
        <div className="mb-6 md:mb-0">
          <p className="font-mono text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Harsha G V · Built like a hardened container image · No plaintext secrets, ever.
          </p>
        </div>

        <div className="flex items-center space-x-6">
          <a href="https://github.com/harshagv" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:-translate-y-1 transition-transform">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/github.svg" alt="GitHub" className="w-6 h-6 filter invert opacity-60 hover:opacity-100 hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all" />
          </a>
          <a href="https://twitter.com/harsha_gv" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:-translate-y-1 transition-transform">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/x.svg" alt="Twitter/X" className="w-6 h-6 filter invert opacity-60 hover:opacity-100 hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all" />
          </a>
          <a href="https://www.linkedin.com/in/harshagv/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:-translate-y-1 transition-transform">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/linkedin.svg" alt="LinkedIn" className="w-6 h-6 filter invert opacity-60 hover:opacity-100 hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all" />
          </a>
          <a href="https://medium.com/@harsha.gv29" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:-translate-y-1 transition-transform">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/medium.svg" alt="Medium" className="w-6 h-6 filter invert opacity-60 hover:opacity-100 hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all" />
          </a>
          <a href="https://www.credly.com/users/harshagv" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:-translate-y-1 transition-transform">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@11.4.0/icons/credly.svg" alt="Credly" className="w-6 h-6 filter invert opacity-60 hover:opacity-100 hover:drop-shadow-[0_0_8px_var(--color-accent)] transition-all" />
          </a>
          <a href="mailto:harsha.gv29@gmail.com" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors inline-block mt-0.5 ml-1">
            <Mail className="w-6 h-6 opacity-60 hover:opacity-100 transition-opacity" />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
