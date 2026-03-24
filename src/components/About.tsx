import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const textToType = [
  "I am a secure container with 65536mb memory and an AWS-certified processor, engineered for safeguarding cloud environments and enhancing security posture. ✰ 😇 🚀\n\n",
  "I am continuously learning to become a Security Jedi (bringing balance to Cloud-verse) ☺︎, and have a passion for technology, with a focus on Cloud, Cybersecurity, Blockchain, GenAI. I am inspired by the mission to help others understand how technology can transform and improve their lives.\n\n",
  "Beyond work, I also love spending time with my friends, cycling, trail hiking, and swimming and always hoping to carve out time for a good book or podcast."
];

const About: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const containerRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    // True Apple cinematic pinning and scrubbing
    gsap.fromTo(terminalRef.current, 
      { opacity: 0, scale: 0.85, y: 150 }, 
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 1.5
        }
      }
    );
  }, { scope: containerRef });

  useEffect(() => {
    let currentText = '';
    const fullText = textToType.join('');
    let i = 0;
    const interval = setInterval(() => {
      currentText += fullText.charAt(i);
      setDisplayText(currentText);
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="whoami" ref={containerRef} className="h-screen w-full flex items-center justify-center px-6 pointer-events-none">
      <div className="max-w-4xl mx-auto w-full z-10 pointer-events-auto">
        <div 
          ref={terminalRef}
          className="bg-[#0d1117]/90 backdrop-blur-md rounded-xl border border-[#30363d] shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Terminal Header */}
          <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <span className="font-mono text-[#8b949e] text-sm">harsha@cloud-fortress:~/whoami</span>
            </div>
            <span className="font-mono text-[var(--color-accent)] text-xs border border-[var(--color-accent)]/50 rounded-full px-3 py-1 bg-black/30 hidden md:block">
              read-only · no root shells here 👀
            </span>
          </div>
          
          {/* Terminal Body */}
          <div className="p-6 md:p-8 font-mono">
            <h3 className="text-[#F4511E] text-2xl font-bold mb-6 font-sans tracking-tight">$ whoami</h3>
            <div className="text-[var(--color-accent)] text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
              {displayText}
              <span className="inline-block w-2.5 h-5 bg-[var(--color-accent)] animate-pulse ml-1 align-middle"></span>
            </div>
            
            <div className="mt-10 pt-6 border-t border-[#30363d] border-dashed">
              <p className="text-white mb-4 text-lg">I thrive on leveraging cutting-edge technologies and methodologies across:</p>
              <ul className="text-[var(--color-accent)] space-y-2 text-lg">
                <li><span className="text-gray-500 mr-2">➼</span>Cybersecurity Engineering</li>
                <li><span className="text-gray-500 mr-2">➼</span>Cloud Security</li>
                <li><span className="text-gray-500 mr-2">➼</span>Application Security</li>
                <li><span className="text-gray-500 mr-2">➼</span>DevSecOps</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
