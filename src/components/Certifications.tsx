import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Odometer from './Odometer';
import { certs, badgeGroups, type Badge } from '../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

// Builds a shields.io "for-the-badge" URL. Spaces → '_', dashes → '--' (shields.io escaping).
const shield = ({ name, color, logo, logoColor = 'white' }: Badge) => {
  const label = encodeURIComponent(name.replace(/-/g, '--').replace(/ /g, '_'));
  const logoParams = logo ? `&logo=${logo}&logoColor=${logoColor}` : '';
  return `https://img.shields.io/badge/${label}-${color}?style=for-the-badge${logoParams}`;
};

const Certifications: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const revealWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(revealWrapperRef.current,
      { clipPath: "circle(0% at 50% 100%)" },
      {
        clipPath: "circle(150% at 50% 100%)",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          end: "top 10%",
          scrub: true,
        }
      }
    );

    gsap.utils.toArray('.cert-list-item').forEach((item: any, i: number) => {
      gsap.fromTo(item,
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.8, delay: (i % 8) * 0.1, ease: "power2.out",
          scrollTrigger: { trigger: item, start: "top 90%", toggleActions: "play none none reverse" }
        }
      );
    });

    // Badge reveals run on the browser's own scroll timeline where supported (see .badge-item in
    // index.css) — ~40 fewer ScrollTriggers on the main thread. GSAP is only the fallback.
    if (!CSS.supports('animation-timeline: view()')) {
      gsap.utils.toArray<HTMLElement>('.badge-item').forEach((badge, i) => {
        gsap.fromTo(badge,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.6,
            delay: (i % 10) * 0.04, // wrap the stagger so later badges don't wait seconds
            ease: 'power3.out',
            scrollTrigger: { trigger: badge, start: 'top 90%', toggleActions: 'play none none reverse' },
          }
        );
      });
    }

    gsap.utils.toArray('.badge-group-title').forEach((title: any) => {
      gsap.fromTo(title,
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: title, start: "top 88%", toggleActions: "play none none reverse" }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section id="certs" ref={containerRef} className="relative pointer-events-none h-auto">

      {/* FIX 1: Removed `flex items-center` so the content isn't pulled up to the top */}
      <div ref={revealWrapperRef} className="relative w-full h-full overflow-hidden">

        {/* No scrim: the globe stays at full brightness through the whole section */}

        {/* FIX 2: Added `pt-36 pb-24`. 
            pt-36 (144px) perfectly matches your original code's spacing (pt-24 + mt-12).
            This pushes the text back down, forcing the user to scroll past the black background of the previous section! */}
        <div className="max-w-6xl mx-auto w-full z-10 pointer-events-auto pt-36 pb-24 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Certificates */}
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight border-l-4 border-[var(--color-accent)] pl-6 mb-8">Certifications</h2>
              <p className="text-gray-400 text-lg mb-8 pl-6">Validation of my expertise across cloud services, security methodologies, and Kubernetes architectures:</p>

              <ol className="pl-6 space-y-4">
                {certs.map((c, i) => (
                  <li key={i} className="cert-list-item flex items-start md:items-center text-white text-lg group">
                    <Odometer value={i + 1} />
                    <a href={c.link} target="_blank" rel="noopener noreferrer" className="font-bold hover:text-[var(--color-accent)] focus:text-[var(--color-accent)] transition-all hover:translate-x-2 outline-none">
                      {c.name}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Ecosystem Badges — grouped by domain */}
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight border-l-4 border-[#0CAFFF] pl-6 mb-8">Ecosystem</h2>
              <div className="pl-6 space-y-7">
                {badgeGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="badge-group-title font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">
                      {group.title}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {group.items.map((b) => (
                        <a
                          key={b.name}
                          href={b.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={b.name}
                          className="badge-item hover:scale-110 transition-transform hover:shadow-[0_0_15px_rgba(12,175,255,0.4)] rounded"
                        >
                          <img src={shield(b)} alt={b.name} loading="lazy" className="h-7 md:h-8 rounded" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;