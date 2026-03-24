import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingTerminal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [output, setOutput] = useState<{ type: 'input' | 'output', text: string }[]>([
    { type: 'output', text: "Welcome to Harsha's Terminal. Type 'help' to start." }
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output, isOpen]);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-terminal', handler);
    return () => window.removeEventListener('open-terminal', handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = inputVal.trim().toLowerCase();
      if (!cmd) return;

      const newOut = [...output, { type: 'input' as const, text: cmd }];
      
      let res = "";
      switch (cmd) {
        case 'help': res = "Available commands: about, skills, contact, clear, exit"; break;
        case 'about': res = "Harsha G V. Cybersecurity Engineer. Securing the cloud, one container at a time."; break;
        case 'skills': res = "AppSec, PAM, CSPM, Security Automation, Vulnerability Management."; break;
        case 'contact': res = "Email: harsha.gv29@gmail.com"; break;
        case 'clear': 
          setOutput([]);
          setInputVal('');
          return;
        case 'exit':
          setIsOpen(false);
          setInputVal('');
          return;
        default: res = `Command not found: ${cmd}. Type 'help'.`;
      }

      newOut.push({ type: 'output', text: res });
      setOutput(newOut);
      setInputVal('');
    }
  };

  return (
    <div className="pointer-events-auto">
      {/* Floating Button */}
      <motion.button 
        className="fixed bottom-6 left-6 z-[100] w-14 h-14 bg-[#0d1117] border-2 border-[var(--color-accent)] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,255,102,0.3)] hover:shadow-[0_0_25px_rgba(0,255,102,0.6)] transition-shadow group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <TerminalIcon className="w-6 h-6 text-[var(--color-accent)] group-hover:animate-pulse" />
      </motion.button>

      {/* Terminal Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 left-6 md:left-24 z-[101] w-[90vw] max-w-lg h-96 bg-[#0d1117]/95 backdrop-blur-xl border border-[var(--color-accent)] rounded-lg shadow-2xl flex flex-col font-mono overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex justify-between items-center cursor-default">
              <span className="text-gray-400 text-sm">guest@harshagv:~$</span>
              <button onClick={() => setIsOpen(false)} className="text-[#ff5f56] hover:text-red-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-4 overflow-y-auto text-lg text-[var(--color-accent)] flex flex-col" onClick={() => inputRef.current?.focus()}>
              {output.map((line, i) => (
                <div key={i} className="mb-2">
                  {line.type === 'input' ? (
                    <div><span className="text-gray-400">guest@harshagv:~$</span> {line.text}</div>
                  ) : (
                    <div className="text-white whitespace-pre-wrap">{line.text}</div>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-2 mt-auto">
                <span className="text-gray-400 min-w-max">guest@harshagv:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-none outline-none text-white w-full flex-1 caret-[var(--color-accent)]"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
              <div ref={bottomRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingTerminal;
