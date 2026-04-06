import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const textToType = [
  "I am a secure container with 65536mb memory and an AWS-certified processor, engineered for safeguarding cloud environments and enhancing security posture. ✰ 😇 🚀\n\n",
  "I am continuously learning to become a Security Jedi (bringing balance to Cloud-verse) ☺︎, and have a passion for technology, with a focus on Cloud, Cybersecurity, Blockchain, Agentic AI. I am inspired by the mission to help others understand how technology can transform and improve their lives.\n\n",
  "Beyond work, I also love spending time with my friends, cycling, trail hiking, and swimming and always hoping to carve out time for a good book or podcast."
];

const About: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const containerRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
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
            scrub: 1.5,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        }
      );
    });

    mm.add("(max-width: 767px)", () => {
      gsap.fromTo(terminalRef.current,
        { opacity: 0, scale: 0.95, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'top 15%',
            pin: false,
          }
        }
      );
    });

    return () => mm.revert();
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
    <div id="whoami" className="relative z-20 w-full scroll-mt-24">
      <section ref={containerRef} className="relative z-20 min-h-screen md:h-[100dvh] w-full flex items-center justify-center px-4 md:px-6 pointer-events-none mt-16 md:mt-0">
        <div className="max-w-4xl mx-auto w-full z-20 pointer-events-auto">
          <div
            ref={terminalRef}
            className="bg-[#0d1117]/90 backdrop-blur-md rounded-xl border border-[#30363d] shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden max-h-none md:max-h-[92dvh]"
          >
            {/* Terminal Header */}
            <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] flex items-center justify-between shrink-0">
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

            {/* Terminal Body - Optimized for tall mobile screens */}
            <div
              className="p-5 md:p-6 md:pb-14 font-mono break-words flex-1 overflow-y-auto scrollbar-hide min-h-0"
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              <style dangerouslySetInnerHTML={{
                __html: `
                  .scrollbar-hide::-webkit-scrollbar { display: none; }
                `
              }} />

              <h3 className="text-[#F4511E] text-2xl font-bold mb-4 font-sans tracking-tight">$ whoami</h3>

              <div className="text-[var(--color-accent)] text-base md:text-[17px] leading-[1.65] whitespace-pre-wrap">
                {displayText}
                <span className="inline-block w-2.5 h-5 bg-[var(--color-accent)] animate-pulse ml-1 align-middle"></span>
              </div>

              {/* Static section - Guaranteed to show */}
              <div className="mt-8 pt-6 border-t border-[#30363d] border-dashed">
                <p className="text-white mb-4 text-base md:text-lg">I thrive on leveraging cutting-edge technologies and methodologies across:</p>
                <ul className="text-[var(--color-accent)] space-y-1.5 text-base md:text-lg">
                  <li><span className="text-gray-500 mr-2">➼</span>Cybersecurity Engineering</li>
                  <li><span className="text-gray-500 mr-2">➼</span>Cloud Security</li>
                  <li><span className="text-gray-500 mr-2">➼</span>Application Security</li>
                  <li><span className="text-gray-500 mr-2">➼</span>DevSecOps</li>
                </ul>

                {/* FIX: Explicit spacer div to force a scrollable gap at the bottom */}
                <div className="h-5 w-full" aria-hidden="true"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;