import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Sections the navbar tracks, in page order. */
export const NAV_SECTIONS = ['whoami', 'work', 'certs', 'contact'] as const;

/**
 * Page-wide scroll polish. Created after boot (so every pin above it already exists and
 * all start/end positions are measured against the final layout). Returns a cleanup.
 *
 *  - Page progress → `--page-progress` on <html> (navbar hairline reads it; no React renders).
 *  - Active section → `section-active` event (navbar highlights the link).
 *  - Section headings wipe in left → right, accent bar first, like a cursor writing the line.
 *  - Hero eases up and away as you leave it (slower than the page = depth).
 *  - Footer harbour art settles from a slight zoom as it scrolls into place.
 */
export function initScrollPolish(): () => void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  const ctx = gsap.context(() => {
    // 1. Progress hairline
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => root.style.setProperty('--page-progress', self.progress.toFixed(4)),
    });

    // 2. Active section for the navbar
    const announce = (id: string | null) =>
      window.dispatchEvent(new CustomEvent('section-active', { detail: id }));
    NAV_SECTIONS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (st) => {
          if (st.isActive) announce(id);
          else if (i === 0 && st.direction < 0) announce(null); // back up into the hero
        },
      });
    });

    if (reduced) return;

    // 3. Heading wipe. A heading inside a pinned panel (Battle Stations) is triggered by the
    //    panel itself, so it finishes before the pin engages instead of mid-way through the track.
    const hidden = { clipPath: 'inset(0% 100% 0% 0%)', x: -24 };
    gsap.utils.toArray<HTMLElement>('.section-heading').forEach((h) => {
      const scope = h.closest<HTMLElement>('[data-wipe-scope]');
      gsap.set(h, hidden);
      ScrollTrigger.create({
        trigger: scope ?? h,
        start: scope ? 'top 75%' : 'top 88%',
        onEnter: () => gsap.to(h, { clipPath: 'inset(0% 0% 0% 0%)', x: 0, duration: 1.1, ease: 'expo.out', overwrite: true }),
        onLeaveBack: () => gsap.to(h, { ...hidden, duration: 0.4, ease: 'power2.in', overwrite: true }),
      });
    });

    // 4. Hero exit — content drifts up at a slower rate, softens and recedes.
    const hero = document.querySelector<HTMLElement>('.hero-content');
    if (hero) {
      gsap.to(hero, {
        yPercent: -14, scale: 0.96, opacity: 0, ease: 'none', transformOrigin: '0% 50%',
        scrollTrigger: { trigger: hero.closest('section'), start: 'top top', end: 'bottom 10%', scrub: 0.6 },
      });
    }

    // 5. Footer art settles from a slight zoom (overflow is clipped by its frame).
    const harbour = document.querySelector<HTMLElement>('.harbour-band');
    if (harbour) {
      gsap.fromTo(harbour, { yPercent: -8, scale: 1.12 }, {
        yPercent: 0, scale: 1, ease: 'none',
        scrollTrigger: { trigger: '#contact', start: 'top bottom', end: 'center bottom', scrub: 0.8 },
      });
    }
  });

  return () => {
    ctx.revert();
    root.style.removeProperty('--page-progress');
  };
}
