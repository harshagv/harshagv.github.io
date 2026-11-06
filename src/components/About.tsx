import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import NodeClock from './NodeClock';

gsap.registerPlugin(ScrollTrigger);

// One entry per paragraph.
const textToType = [
  "I am a secure container with 65536mb memory and an AWS-certified processor, engineered for safeguarding cloud environments and enhancing security posture. ✰ 😇 🚀",
  "I am continuously learning to become a Security Jedi (bringing balance to Cloud-verse) ☺︎, and have a passion for technology, with a focus on Cloud, Cybersecurity, Blockchain, Agentic AI. I am inspired by the mission to help others understand how technology can transform and improve their lives.",
  "Beyond work, I also love spending time with my friends, cycling, trail hiking, and swimming and always hoping to carve out time for a good book or podcast."
];

// Apple-style "read-along" copy: each word starts dim and lights up as the reader scrolls.
const LitParagraphs: React.FC<{ paragraphs: string[] }> = ({ paragraphs }) => (
  <>
    {paragraphs.map((para, pi) => (
      <p key={pi} className={pi < paragraphs.length - 1 ? 'mb-5' : ''}>
        {para.trim().split(/(\s+)/).map((w, i) => (/\s/.test(w) ? w : <span key={i} className="lit">{w}</span>))}
        {pi === paragraphs.length - 1 && (
          <span className="inline-block w-2.5 h-5 bg-[var(--color-accent)] animate-blink-step ml-1 align-middle" />
        )}
      </p>
    ))}
  </>
);

const About: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      desktop: '(min-width: 768px)',
      mobile: '(max-width: 767px)',
      reduced: '(prefers-reduced-motion: reduce)',
    }, (ctx) => {
      const { desktop, reduced } = ctx.conditions as Record<string, boolean>;
      const words = gsap.utils.toArray<HTMLElement>('.lit', copyRef.current);

      if (reduced) {
        gsap.set(words, { opacity: 1 });
        gsap.set(terminalRef.current, { opacity: 1, scale: 1, y: 0 });
        return;
      }

      if (desktop) {
        // One pinned timeline: the terminal rises into place, then the copy lights up word by word.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(terminalRef.current,
          { opacity: 0, scale: 0.85, y: 150 },
          { opacity: 1, scale: 1, y: 0, ease: 'power2.out', duration: 0.3 })
          .fromTo(words, { opacity: 0.14 }, { opacity: 1, ease: 'none', stagger: 0.7 / words.length, duration: 0.05 }, '>-0.05')
          .to({}, { duration: 0.1 }); // short hold once everything is lit
      } else {
        gsap.fromTo(terminalRef.current,
          { opacity: 0, scale: 0.95, y: 50 },
          { opacity: 1, scale: 1, y: 0, ease: 'power2.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 85%', end: 'top 15%' } });
        gsap.fromTo(words, { opacity: 0.14 }, {
          opacity: 1, ease: 'none', stagger: 0.05,
          scrollTrigger: { trigger: copyRef.current, start: 'top 75%', end: 'bottom 55%', scrub: true },
        });
      }
    });

    return () => mm.revert();
  }, { scope: containerRef });

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
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <span className="font-mono text-[#8b949e] text-sm">harsha@cloud-fortress:~/whoami</span>
                <NodeClock />
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
                  @keyframes blink-step { 50% { opacity: 0; } }
                  .animate-blink-step { animation: blink-step 1s steps(1) infinite; }
                `
              }} />

              <h3 className="text-[#F4511E] text-2xl font-bold mb-4 font-sans tracking-tight">$ whoami</h3>

              <div ref={copyRef} className="text-[var(--color-accent)] text-base md:text-[17px] leading-[1.65]">
                <LitParagraphs paragraphs={textToType} />
              </div>

              {/* Static section - Guaranteed to show */}
              <div className="mt-8 pt-6 border-t border-[#30363d] border-dashed">
                <p className="text-white mb-4 text-base md:text-lg">I thrive on leveraging cutting-edge technologies and methodologies across:</p>
                <ul className="text-[var(--color-accent)] space-y-1.5 text-base md:text-lg">
                  <li><span className="text-[var(--color-accent)] mr-3 mt-1">▹</span>Cybersecurity Engineering</li>
                  <li><span className="text-[var(--color-accent)] mr-3 mt-1">▹</span>Cloud Security</li>
                  <li><span className="text-[var(--color-accent)] mr-3 mt-1">▹</span>Application Security</li>
                  <li><span className="text-[var(--color-accent)] mr-3 mt-1">▹</span>DevSecOps</li>
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