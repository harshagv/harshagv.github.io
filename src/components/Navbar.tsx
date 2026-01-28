import React from 'react';
import { Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 px-6 py-3 pointer-events-auto">
        <div className="text-xl font-bold tracking-tighter text-white">
          <span className="text-[var(--color-accent)]">H</span>arsha.
        </div>
        <ul className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <li className="hover:text-white transition-colors cursor-pointer">Home</li>
          <li className="hover:text-white transition-colors cursor-pointer">About</li>
          <li className="hover:text-white transition-colors cursor-pointer">Work</li>
          <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
        </ul>
        <button className="md:hidden text-white hover:text-[var(--color-accent)] transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
