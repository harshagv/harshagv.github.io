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

type Pose = Partial<typeof globe>;
type Leg = [selector: string, to: Pose];

// Each leg starts as its section's top enters the viewport and lands as it reaches the top,
// so the globe's move is always tied to the content that caused it.
const LEGS: Leg[] = [
  ['#whoami',   { x: -2.0, y: -0.5, z: -2,  rx: Math.PI / 4,  ry: Math.PI / 6,  s: 1.6, focus: 0 }],
  ['#work',     { x: 2.5,  y: 1,    z: -4,  rx: -Math.PI / 6, ry: Math.PI / 4,  s: 0.8 }],
  ['#kinetics', { x: -4.0, y: -2.0, z: -10, rx: Math.PI / 3,  ry: -Math.PI / 3, s: 0.4 }],
  ['#certs',    { x: 0,    y: 0,    z: 2,   rx: -Math.PI / 4, ry: Math.PI / 6,  s: 1.3 }],
];

// Portrait phones see a much narrower slice of the scene (≈ ±1.9 units wide at z = 0 vs ±5.3 on
// a laptop), so the desktop poses push the globe off-screen. Same choreography, re-framed:
// in the hero it sits low-right behind the CTAs with Sydney facing the reader.
const MOBILE_HERO: Pose = { x: 0.9, y: -2.0, s: 0.85 };
const MOBILE_LEGS: Leg[] = [
  ['#whoami',   { x: -1.2, y: -0.4, z: -2,  rx: Math.PI / 4,  ry: Math.PI / 6,  s: 1.3, focus: 0 }],
  ['#work',     { x: 1.3,  y: 2.0,  z: -4,  rx: -Math.PI / 6, ry: Math.PI / 4,  s: 0.8 }],
  ['#kinetics', { x: -1.6, y: -2.4, z: -10, rx: Math.PI / 3,  ry: -Math.PI / 3, s: 0.45 }],
  ['#certs',    { x: 0,    y: 0.4,  z: 2,   rx: -Math.PI / 4, ry: Math.PI / 6,  s: 1.0 }],
];
const DESKTOP_HERO: Pose = { x: 3, y: 0, s: 1 };

/** Call once after boot. Returns a cleanup function. */
export function initGlobeDirector(): () => void {
  const mm = gsap.matchMedia();

  const ctx = gsap.context(() => {
    // Intro: once the boot overlay clears, the globe swings round and locks onto Sydney.
    // Then it hands back to the normal spin, so Australia carries on rotating past like the real Earth.
    gsap.to(globe, {
      lock: 1, tilt: 1, duration: 2.4, ease: 'power3.inOut', delay: 0.4,
      onComplete: () => { globe.handoff = true; },
    });

    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => { scrollState.progress = self.progress; },
    });
  });

  // Re-runs (and reverts the other set) when the phone rotates or a window crosses 768px.
  const build = (hero: Pose, legs: Leg[]) => () => {
    if (window.scrollY < window.innerHeight * 0.5) gsap.set(globe, hero);
    legs.forEach(([sel, to]) => {
      if (!document.querySelector(sel)) return;
      gsap.fromTo(globe, legBefore(legs, sel, hero), {
        ...to,
        ease: 'power2.inOut',
        immediateRender: false,
        scrollTrigger: { trigger: sel, start: 'top bottom', end: 'top top', scrub: 1.2 },
      });
    });
  };
  mm.add('(max-width: 767px)', build(MOBILE_HERO, MOBILE_LEGS));
  mm.add('(min-width: 768px)', build(DESKTOP_HERO, LEGS));

  return () => { mm.revert(); ctx.revert(); };
}

/** The pose a leg starts from: the previous leg's end, or the hero pose for the first one. */
function legBefore(legs: Leg[], sel: string, hero: Pose): Pose {
  const i = legs.findIndex(([s]) => s === sel);
  const base: Pose = { x: 3, y: 0, z: 0, rx: 0, ry: 0, s: 1, focus: 1, ...hero };
  return legs.slice(0, i).reduce<Pose>((acc, [, to]) => ({ ...acc, ...to }), base);
}
