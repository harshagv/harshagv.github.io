import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Shared, mutable state that GSAP writes and the R3F render loop reads.
 * Keeping it outside React means scroll never triggers a re-render and the
 * WebGL loop never reads layout (no scrollHeight / scrollY per frame).
 */
export const globe = {
  x: 3, y: 0, z: 0,
  rx: 0, ry: 0,
  s: 1,
  /** 0..1 — hero-only tilt that brings Sydney's latitude to the centre (scroll-driven release). */
  focus: 1,
  /** 0..1 — intro yaw "acquire target" after boot. Handed back to the spin once it completes. */
  lock: 0,
  /** 0..1 — intro tilt amount (stays at 1; scaled by `focus`). */
  tilt: 0,
  /** Set when the acquire finishes; the render loop folds the locked yaw into the spin. */
  handoff: false,
};

/** Page scroll progress 0..1, updated by ScrollTrigger (for the parallax starfield). */
export const scrollState = { progress: 0 };

// Sydney, in the same lat/lon → xyz convention as LocationMarker in Scene.tsx
export const SYD_LAT = (-33.8688 * Math.PI) / 180;
export const SYD_LON = (151.2093 * Math.PI) / 180;

type Leg = [selector: string, to: Partial<typeof globe>];

// Each leg starts as its section's top enters the viewport and lands as it reaches the top,
// so the globe's move is always tied to the content that caused it.
const LEGS: Leg[] = [
  ['#whoami',   { x: -2.0, y: -0.5, z: -2,  rx: Math.PI / 4,  ry: Math.PI / 6,  s: 1.6, focus: 0 }],
  ['#work',     { x: 2.5,  y: 1,    z: -4,  rx: -Math.PI / 6, ry: Math.PI / 4,  s: 0.8 }],
  ['#kinetics', { x: -4.0, y: -2.0, z: -10, rx: Math.PI / 3,  ry: -Math.PI / 3, s: 0.4 }],
  ['#certs',    { x: 0,    y: 0,    z: 2,   rx: -Math.PI / 4, ry: Math.PI / 6,  s: 1.3 }],
];

/** Call once after boot. Returns a cleanup function. */
export function initGlobeDirector(): () => void {
  const ctx = gsap.context(() => {
    // Intro: once the boot overlay clears, the globe swings round and locks onto Sydney.
    // Then it hands back to the normal spin, so Australia carries on rotating past like the real Earth.
    gsap.to(globe, {
      lock: 1, tilt: 1, duration: 2.4, ease: 'power3.inOut', delay: 0.4,
      onComplete: () => { globe.handoff = true; },
    });

    LEGS.forEach(([sel, to]) => {
      if (!document.querySelector(sel)) return;
      gsap.to(globe, {
        ...to,
        ease: 'power2.inOut',
        immediateRender: false,
        scrollTrigger: { trigger: sel, start: 'top bottom', end: 'top top', scrub: 1.2 },
      });
    });

    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => { scrollState.progress = self.progress; },
    });
  });
  return () => ctx.revert();
}
