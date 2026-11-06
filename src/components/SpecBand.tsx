import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { certs, badgeGroups, stations } from '../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

// Every figure is derived from content already on the page, so it can never drift out of date.
const specs = [
  { value: certs.length, label: 'Industry certifications', note: 'AWS · Kubernetes · ISC²' },
  { value: stations.length, label: 'Security domains', note: 'identity → GenAI defence' },
  { value: badgeGroups.reduce((n, g) => n + g.items.length, 0), label: 'Tools in the stack', note: 'cloud · detection · AppSec' },
];

/** Apple-style "spec sheet": oversized numbers that count up and catch a light sweep on scroll. */
const SpecBand: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.utils.toArray<HTMLElement>('.spec-num').forEach((el) => {
      const end = Number(el.dataset.value);
      if (reduced) { el.textContent = String(end); return; }

      const counter = { v: 0 };
      el.textContent = '0';
      gsap.to(counter, {
        v: end,
        ease: 'power1.out',
        snap: { v: 1 },
        onUpdate: () => { el.textContent = String(counter.v); },
        scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 50%', scrub: true },
      });
      gsap.fromTo(el, { backgroundPosition: '100% 0' }, {
        backgroundPosition: '0% 0',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    if (!reduced) {
      gsap.fromTo('.spec-item', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
      });
    }
  }, { scope: rootRef });

  return (
    <section ref={rootRef} aria-label="At a glance"
      className="relative w-full py-28 md:py-40 px-6 pointer-events-none bg-[#020202]/30 backdrop-blur-sm border-y border-[#30363d]/50">
      <p className="max-w-6xl mx-auto mb-12 md:mb-16 font-mono text-[var(--color-accent)] text-sm md:text-base tracking-wide pointer-events-auto">
        &gt; NODE_SPECS --summary
      </p>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-8 pointer-events-auto">
        {specs.map((s) => (
          <div key={s.label} className="spec-item text-center md:text-left">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">{s.label}</p>
            <p className="spec-num font-black leading-none tabular-nums" data-value={s.value}
              aria-label={`${s.value} ${s.label}`}>
              {s.value}
            </p>
            <p className="mt-4 text-gray-400 text-base md:text-lg font-light">{s.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpecBand;
