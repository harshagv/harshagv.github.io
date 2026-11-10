import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import RiskTour from './RiskTour';
import { stations } from '../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

// Pointer-tracked spotlight: writes CSS vars only, no React state.
const spotlight = (e: React.PointerEvent<HTMLDivElement>) => {
  if (e.pointerType !== 'mouse') return; // touch drags shouldn't leave a stray highlight
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

const Experience: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const wrapper = scrollWrapperRef.current;
    const content = scrollContentRef.current;
    if (!wrapper || !content) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const total = stations.length;

    // 1. Horizontal track (unchanged distance maths) — now also drives the rail + "03 / 07" readout.
    const track = gsap.to(content, {
      x: () => -(content.scrollWidth - window.innerWidth + 50), // 50px buffer ensures the final card clears the right-edge on mobile
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        pin: true,
        scrub: 1,
        start: 'center center',
        end: () => `+=${content.scrollWidth}`,
        invalidateOnRefresh: true, // Auto-recalculate Math if mobile orientation flips
        onUpdate: (st) => {
          if (!counterRef.current) return;
          const n = String(Math.min(total, Math.round(st.progress * (total - 1)) + 1)).padStart(2, '0');
          if (counterRef.current.textContent !== n) counterRef.current.textContent = n;
        },
      },
    });

    gsap.fromTo('.stations-rail', { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: wrapper, start: 'center center', end: () => `+=${content.scrollWidth}`, scrub: 1, invalidateOnRefresh: true },
    });

    if (!reduced) {
      // 2. "Screen opening" — the panel starts as an inset, rounded display and grows to full-bleed,
      //    landing exactly as the pin engages (like Apple's display showcase).
      const opening = { trigger: wrapper, start: 'top bottom', end: 'center center', scrub: true };
      gsap.fromTo(wrapper,
        { clipPath: 'inset(14% 7% round 28px)' },
        { clipPath: 'inset(0% 0% round 0px)', ease: 'none', scrollTrigger: opening });
      gsap.fromTo(content, { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { ...opening } });

      // 3. Focus: each card brightens and settles to full size as it reaches the reading zone.
      gsap.utils.toArray<HTMLElement>('.station-card').forEach((card) => {
        gsap.fromTo(card, { opacity: 0.35, scale: 0.92 }, {
          opacity: 1, scale: 1, ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: track, start: 'left 90%', end: 'left 50%', scrub: true },
        });
      });
    }

    // 4. Cinematic 3D lift for the Learning block (transform/opacity only — no scrubbed blur).
    gsap.utils.toArray<HTMLElement>('.reveal-card').forEach((card) => {
      gsap.fromTo(card,
        { autoAlpha: 0, y: 150, rotationX: -15, scale: 0.95, transformPerspective: 1000 },
        { autoAlpha: 1, y: 0, rotationX: 0, scale: 1,
          scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 40%', scrub: 1 } });
    });

    gsap.utils.toArray<HTMLElement>('.reveal-text').forEach((text) => {
      gsap.fromTo(text, { autoAlpha: 0, x: -40 }, {
        autoAlpha: 1, x: 0,
        scrollTrigger: { trigger: text, start: 'top 95%', end: 'top 70%', scrub: 1 },
      });
    });

  }, { scope: containerRef });

  return (
    <section id="work" ref={containerRef} className="py-24 pointer-events-none relative w-full overflow-x-clip">

      {/* Horizontal Scroll Wrapper */}
      <div ref={scrollWrapperRef} data-wipe-scope className="h-[100svh] w-full flex flex-col justify-center overflow-hidden z-10 pointer-events-auto bg-[#020202]/60 md:bg-[#020202]/30 md:backdrop-blur-sm border-y border-[#30363d]/50">
        <div className="w-[90%] max-w-6xl mx-auto mb-8 md:mb-12 shrink-0">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight border-l-4 border-[var(--color-accent)] pl-6 mb-4 section-heading">Security Battle Stations</h2>
          <div className="flex items-end justify-between gap-6 pl-6">
            <p className="text-gray-400 text-lg md:text-xl">Scroll to explore where I harden systems <em>before</em> attackers arrive:</p>
            <p className="font-mono text-sm tracking-[0.2em] text-gray-500 shrink-0" aria-hidden="true">
              <span ref={counterRef} className="text-[var(--color-accent)]">01</span> / {String(stations.length).padStart(2, '0')}
            </p>
          </div>
          <div className="ml-6 mt-5 h-[2px] bg-white/10 rounded-full overflow-hidden" aria-hidden="true">
            <div className="stations-rail h-full w-full origin-left bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]" style={{ transform: 'scaleX(0)' }} />
          </div>
        </div>

        <div className="w-full overflow-hidden flex items-center">
          <div ref={scrollContentRef} className="flex gap-8 px-[5vw] w-max items-stretch pb-12">
            {stations.map((s, i) => (
              <div
                key={i}
                onPointerMove={spotlight}
                className="station-card shrink-0 w-[350px] md:w-[450px] min-h-[300px] bg-[#0d1117]/80 backdrop-blur-xl border border-[#30363d] rounded-2xl p-8 flex flex-col justify-between shadow-2xl hover:border-[var(--color-accent)] transition-colors duration-300"
              >
                <div>
                  <h4 className="text-[var(--color-accent-cyan)] font-bold text-xl md:text-2xl mb-4 uppercase tracking-wide">{s.title}</h4>
                  <p className="text-gray-300 text-base mb-6 leading-relaxed">{s.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {s.tags.map(tag => (
                    <span key={tag} className="text-xs font-mono text-[var(--color-accent)] border border-[var(--color-accent)]/40 rounded-full px-3 py-1 bg-black/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto z-10 pointer-events-auto px-6 mt-32">
        {/* Threat Model — sticky feature tour */}
        <RiskTour />

        {/* Currently Learning Section */}
        <div className="reveal-card mt-12 bg-[#0d1117]/60 border border-[var(--color-accent)]/20 rounded-2xl p-8 backdrop-blur-md shadow-lg">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="text-[var(--color-accent)] block animate-pulse">⚡</span> Currently Learning & Exploring: My Security Jedi Training Continues
          </h3>
          <p className="text-gray-400 mb-6">The path to bringing balance to the Cloud-verse requires constant evolution. My current focus areas include:</p>
          <ul className="space-y-4 text-gray-300 text-lg">
            <li className="reveal-text flex items-start"><span className="text-[var(--color-accent)] mr-3 mt-1">▹</span> <div><strong className="text-white">eBPF-Powered Defenses:</strong> Exploring advanced runtime security, syscall-level detection and kernel-side observability.</div></li>
            <li className="reveal-text flex items-start"><span className="text-[var(--color-accent)] mr-3 mt-1">▹</span> <div><strong className="text-white">Agentic AI for Autonomous Security:</strong> Delving into agentic AI for autonomous threat detection, triage and auto-remediation.</div></li>
            <li className="reveal-text flex items-start"><span className="text-[var(--color-accent)] mr-3 mt-1">▹</span> <div><strong className="text-white">Post-Quantum Cryptography (PQC) & Advanced Privacy:</strong> Understanding PQC, FHE and privacy-enhancing tech that can survive future cryptanalytic breakthroughs.</div></li>
            <li className="reveal-text flex items-start"><span className="text-[var(--color-accent)] mr-3 mt-1">▹</span> <div><strong className="text-white">Blockchain for Verifiable Cloud Security:</strong> Researching how append-only ledgers can anchor digital forensics and supply-chain integrity.</div></li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Experience;