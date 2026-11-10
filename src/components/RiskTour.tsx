import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    key: 'IDENTITY',
    title: 'Identity first',
    body: 'If an attacker compromises identity, they own your blast radius—so I prioritise hardening authentication, authorisation and path-to-prod.',
  },
  {
    key: 'SIGNAL',
    title: 'Signal over noise',
    body: 'More alerts ≠ more security. I design detections that map to attacker behaviours, not just misconfigurations.',
  },
  {
    key: 'GUARDRAILS',
    title: 'Secure-by-default',
    body: 'Developers should have to work harder to make something insecure than secure. Guardrails & golden paths > manual reviews.',
  },
  {
    key: 'EVIDENCE',
    title: 'Evidence-driven decisions',
    body: 'Whether it’s a CSPM alert or a SOC playbook, the question is always: “What data proves this is happening?”',
  },
];

// Deterministic "noise" field for the Signal state (no Math.random → stable between renders).
const NOISE = Array.from({ length: 46 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.6789;
  return { x: 40 + (a - Math.floor(a)) * 320, y: 50 + (b - Math.floor(b)) * 300 };
});
const SIGNAL_PATH = [{ x: 90, y: 300 }, { x: 170, y: 210 }, { x: 250, y: 160 }, { x: 320, y: 90 }];

const RESOURCES = Array.from({ length: 6 }, (_, i) => {
  const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
  return { x: 200 + Math.cos(a) * 135, y: 200 + Math.sin(a) * 135 };
});

// Same roles as the rest of the site: cyan marks the subject of this (cyan-coded) section,
// hacker-green marks what is secured / verified, GitHub-grey (#8b949e, #30363d) is neutral chrome.
const GREEN = '#00ff66';  // --color-accent
const CYAN = '#0CAFFF';   // --color-accent-cyan
const MUTED = '#8b949e';

/** One SVG, four states. Layers cross-fade on `step`; each layer has a little ambient motion. */
const RiskVisual: React.FC<{ step: number }> = ({ step }) => {
  const layer = (i: number): React.CSSProperties => ({
    opacity: step === i ? 1 : 0,
    transform: step === i ? 'scale(1)' : 'scale(0.94)',
    transformOrigin: '200px 200px',
    transition: 'opacity .6s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)',
  });

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" role="img"
      aria-label={`${principles[step].title} illustration`}>
      <defs>
        <radialGradient id="rt-glow">
          <stop offset="0%" stopColor={CYAN} stopOpacity=".35" />
          <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
        </radialGradient>
      </defs>


      {/* 01 — Identity: blast radius collapses to a locked core */}
      <g style={layer(0)}>
        {RESOURCES.map((r, i) => (
          <g key={i}>
            <line x1="200" y1="200" x2={r.x} y2={r.y} stroke={CYAN} strokeOpacity=".35" strokeDasharray="4 6" className="rt-flow" />
            <rect x={r.x - 14} y={r.y - 14} width="28" height="28" rx="6" fill="#0d1117" stroke={MUTED} strokeOpacity=".7" />
          </g>
        ))}
        <circle cx="200" cy="200" r="70" fill="url(#rt-glow)" />
        <circle cx="200" cy="200" r="44" fill="none" stroke={GREEN} strokeWidth="2" strokeDasharray="10 8" className="rt-spin" />
        <circle cx="200" cy="200" r="30" fill="#0d1117" stroke={CYAN} strokeWidth="2" />
        <text x="200" y="205" textAnchor="middle" fill={CYAN} fontFamily="'Fira Code', monospace" fontSize="14" fontWeight="700">ID</text>
      </g>

      {/* 02 — Signal: one attacker path lit up inside a field of noise */}
      <g style={layer(1)}>
        {NOISE.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r="2.5" fill={MUTED} opacity=".35" className="rt-twinkle"
            style={{ animationDelay: `${(i % 7) * 0.35}s` }} />
        ))}
        <polyline points={SIGNAL_PATH.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke={CYAN}
          strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 7" className="rt-flow" />
        {SIGNAL_PATH.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="16" fill="url(#rt-glow)" />
            <circle cx={p.x} cy={p.y} r="6" fill={CYAN} />
          </g>
        ))}
      </g>

      {/* 03 — Secure-by-default: a golden path between guardrails */}
      <g style={layer(2)}>
        <path d="M120 360 C 140 260, 260 220, 250 40" fill="none" stroke={GREEN} strokeOpacity=".7" strokeWidth="3" />
        <path d="M200 360 C 220 260, 340 220, 330 40" fill="none" stroke={GREEN} strokeOpacity=".7" strokeWidth="3" />
        <path id="rt-golden" d="M160 360 C 180 260, 300 220, 290 40" fill="none" stroke={CYAN}
          strokeOpacity=".35" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
        {[0, 1, 2].map((i) => (
          <circle key={i} r="7" fill={CYAN} className="rt-travel" style={{ animationDelay: `${i * 1.1}s` }} />
        ))}
        {[70, 130, 190, 250, 310].map((y, i) => (
          <g key={y} opacity=".5">
            <line x1={118 + i * 30} y1={y + 40} x2={132 + i * 30} y2={y + 40} stroke={GREEN} />
          </g>
        ))}
      </g>

      {/* 04 — Evidence: a timeline of log entries, each one verified */}
      <g style={layer(3)}>
        <line x1="90" y1="80" x2="90" y2="340" stroke="#30363d" strokeWidth="2" />
        {['auth.failure × 41', 'token.issued  new ASN', 'role.assumed  admin', 's3.get  8.2 GB'].map((t, i) => (
          <g key={i} transform={`translate(0 ${90 + i * 68})`}>
            <circle cx="90" cy="0" r="8" fill="#0d1117" stroke={i === 3 ? GREEN : CYAN} strokeWidth="2" />
            <rect x="115" y="-18" width="230" height="36" rx="8" fill="#0d1117" stroke="#30363d" />
            <text x="130" y="5" fill={i === 3 ? GREEN : '#d1d5db'} fontFamily="'Fira Code', monospace" fontSize="12">{t}</text>
            <path d="M318 0 l6 6 l12 -12" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"
              className="rt-tick" style={{ animationDelay: `${0.3 + i * 0.35}s` }} />
          </g>
        ))}
      </g>
    </svg>
  );
};

const RiskTour: React.FC = () => {
  const [step, setStep] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    // Where a step "reads" from: mid-screen beside the panel on desktop; on phones, the middle of
    // the space left below the sticky panel (which takes the top ~40% of the screen).
    mm.add({ phone: '(max-width: 767px)', wide: '(min-width: 768px)' }, (ctx) => {
      const line = (ctx.conditions as Record<string, boolean>).phone ? '64%' : '60%';
      gsap.utils.toArray<HTMLElement>('.risk-step').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: `top ${line}`,
          end: `bottom ${line}`,
        // Created before Experience's horizontal pin (child effects run first), so refresh after it.
        refreshPriority: -1,
          onToggle: (st) => { if (st.isActive) setStep(i); },
        });
      });
    });
    return () => mm.revert();
  }, { scope: rootRef });

  return (
    <div ref={rootRef} className="relative">
      <h3 className="text-2xl md:text-4xl font-black text-white mb-8 md:mb-10 border-l-4 border-[var(--color-accent-cyan)] pl-6 section-heading">How I Think About Risk</h3>

      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        {/* Sticky visual — pinned by CSS, state switched by ScrollTrigger */}
        {/* Phones: solid fill and no backdrop blur — a blurred sticky layer over the WebGL canvas
            repaints on every scroll frame on iOS. Text scrolling up slides cleanly under it. */}
        <div className="sticky top-[84px] md:top-[18vh] z-10 h-[30svh] md:h-[64vh] self-start rounded-2xl bg-[#0a0d11] md:bg-transparent md:bg-gradient-to-br md:from-[#0d1117]/90 md:to-black/90 md:backdrop-blur-md p-2 md:p-6 border border-[var(--color-accent-cyan)]/20 shadow-2xl"
          data-step={step}>
          <p className="absolute top-3 left-4 md:top-5 md:left-6 font-mono text-[10px] md:text-xs tracking-[0.2em] text-[#8b949e]" aria-hidden="true">
            {`0${step + 1} / 04 · ${principles[step].key}`}
          </p>
          <RiskVisual step={step} />
          {/* soft edge so text fades as it passes under the panel (phones only) */}
          <div className="md:hidden absolute left-0 right-0 -bottom-8 h-8 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none" aria-hidden="true" />
        </div>

        <ol className="md:py-[18vh]">
          {principles.map((p, i) => (
            <li key={p.key}
              className="risk-step min-h-[45svh] md:min-h-[64vh] flex items-center transition-opacity duration-500"
              style={{ opacity: step === i ? 1 : 0.3 }}
              aria-current={step === i ? 'step' : undefined}>
              <div>
                <span className="font-mono text-[var(--color-accent-cyan)] font-bold text-sm tracking-[0.2em]">0{i + 1}.</span>
                <h4 className="text-white text-2xl md:text-4xl font-bold mt-2 mb-3 md:mb-4 tracking-tight">{p.title}</h4>
                <p className="text-gray-300 text-base md:text-xl leading-relaxed">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RiskTour;
