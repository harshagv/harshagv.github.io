import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const THREAT_LABELS = [
    'ZERO-DAY', 'LATERAL MOVE', 'C2 BEACON',
    'PRIV-ESC', 'DATA EXFIL', 'SUPPLY CHAIN',
    'RANSOMWARE', 'IDENTITY THEFT', 'SHADOW IT',
];

const HEX_RINGS = [140, 240, 360, 500]; // radii in px

// Evenly spread N points around a circle
const ring = (r: number, n: number) =>
    Array.from({ length: n }, (_, i) => {
        const a = (i / n) * 2 * Math.PI;
        return { x: Math.cos(a) * r, y: Math.sin(a) * r };
    });

const ScrollKinetics: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const sceneRef = useRef<HTMLDivElement>(null);
    const cubeRef = useRef<HTMLDivElement>(null);
    const ringsRef = useRef<HTMLDivElement>(null);
    const labelsRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: () => window.innerWidth < 768 ? '+=80%' : '+=250%', // 80% enables single-swipe navigation on mobile, 2.5x retains deep-scrub depth on desktop
                pin: true,
                scrub: 1.2,
                anticipatePin: 1,
                invalidateOnRefresh: true, // Re-evaluates target height on layout shift
            },
        });

        /* ── Phase 0 (0→0.15): scene fades in from black ──────────────────── */
        tl.fromTo(sceneRef.current,
            { opacity: 0, filter: 'blur(20px)' },
            { opacity: 1, filter: 'blur(0px)', duration: 0.15, ease: 'power2.out' },
            0
        );

        /* ── Phase 1 (0→0.5): rings fly toward camera (translateZ) ────────── */
        gsap.utils.toArray<HTMLElement>('.sk-ring').forEach((ring, i) => {
            tl.fromTo(ring,
                { z: -800 - i * 200, opacity: 0, rotateZ: -60 + i * 20 },
                { z: 200, opacity: 1, rotateZ: 0, duration: 0.5, ease: 'power3.out' },
                i * 0.04             // stagger start times along the scrub
            );
        });

        /* ── Phase 1b: rings keep drifting PAST camera as scroll continues ── */
        gsap.utils.toArray<HTMLElement>('.sk-ring').forEach((ring, i) => {
            tl.to(ring,
                { z: 1200, opacity: 0, duration: 0.35, ease: 'power2.in' },
                0.45 + i * 0.03
            );
        });

        /* ── Phase 2 (0.1→0.7): cube rotates on all 3 axes ───────────────── */
        tl.fromTo(cubeRef.current,
            { rotateX: -60, rotateY: -120, rotateZ: 30, scale: 0.3, opacity: 0 },
            { rotateX: 360, rotateY: 360, rotateZ: -30, scale: 1, opacity: 1, duration: 0.6, ease: 'none' },
            0.1
        );

        /* ── Phase 3 (0.3→0.65): threat labels drift in from depth ────────── */
        gsap.utils.toArray<HTMLElement>('.sk-label').forEach((el, i) => {
            const delay = 0.3 + (i / THREAT_LABELS.length) * 0.25;
            tl.fromTo(el,
                { z: -600, opacity: 0, scale: 0.4 },
                { z: 0, opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' },
                delay
            );
        });

        /* ── Phase 4 (0.7→1.0): everything implodes — exit wipe ───────────── */
        tl.to([cubeRef.current, labelsRef.current], {
            scale: 0.05, opacity: 0, rotateY: 720, duration: 0.25, ease: 'power4.in',
        }, 0.73);

        tl.to(ringsRef.current, {
            scale: 0, opacity: 0, duration: 0.2, ease: 'power3.in',
        }, 0.75);

        tl.to(overlayRef.current, {
            opacity: 1, duration: 0.15,
        }, 0.88);

        // Subtle continuous ring slow-spin (not scrub-driven — always on)
        gsap.utils.toArray<HTMLElement>('.sk-ring').forEach((ring, i) => {
            gsap.to(ring, {
                rotateZ: `+=${i % 2 === 0 ? 360 : -360}`,
                duration: 20 + i * 4,
                repeat: -1,
                ease: 'none',
            });
        });

    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen overflow-hidden bg-[#020202] flex items-center justify-center"
            style={{ perspective: '900px', perspectiveOrigin: '50% 50%' }}
        >
            {/* Scene root — all 3D children live here */}
            <div
                ref={sceneRef}
                className="absolute inset-0 flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
            >

                {/* ── Hex Rings ── */}
                <div
                    ref={ringsRef}
                    className="absolute"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {HEX_RINGS.map((r, ri) => (
                        <div
                            key={ri}
                            className="sk-ring absolute"
                            style={{
                                width: r * 2,
                                height: r * 2,
                                marginLeft: -r,
                                marginTop: -r,
                                borderRadius: '50%',
                                border: `1px solid ${ri % 2 === 0 ? 'rgba(0,255,102,0.25)' : 'rgba(12,175,255,0.2)'}`,
                                boxShadow: `0 0 ${12 + ri * 6}px ${ri % 2 === 0 ? 'rgba(0,255,102,0.15)' : 'rgba(12,175,255,0.12)'}`,
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            {/* Dots on ring */}
                            {ring(r, 6 + ri * 2).map((pt, di) => (
                                <div
                                    key={di}
                                    className="absolute w-1.5 h-1.5 rounded-full"
                                    style={{
                                        left: r + pt.x - 3,
                                        top: r + pt.y - 3,
                                        background: ri % 2 === 0 ? 'rgba(0,255,102,0.7)' : 'rgba(12,175,255,0.7)',
                                        boxShadow: `0 0 6px ${ri % 2 === 0 ? '#00ff66' : '#0cafff'}`,
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* ── Central 3D CSS Cube ── */}
                <div
                    ref={cubeRef}
                    className="absolute"
                    style={{
                        width: 80, height: 80,
                        transformStyle: 'preserve-3d',
                        opacity: 0,
                    }}
                >
                    {/* 6 faces */}
                    {[
                        { transform: 'rotateY(0deg)   translateZ(40px)', color: 'rgba(0,255,102,0.15)' },
                        { transform: 'rotateY(180deg) translateZ(40px)', color: 'rgba(0,255,102,0.15)' },
                        { transform: 'rotateY(90deg)  translateZ(40px)', color: 'rgba(12,175,255,0.15)' },
                        { transform: 'rotateY(-90deg) translateZ(40px)', color: 'rgba(12,175,255,0.15)' },
                        { transform: 'rotateX(90deg)  translateZ(40px)', color: 'rgba(255,255,255,0.08)' },
                        { transform: 'rotateX(-90deg) translateZ(40px)', color: 'rgba(255,255,255,0.08)' },
                    ].map((face, fi) => (
                        <div
                            key={fi}
                            className="absolute inset-0 border"
                            style={{
                                transform: face.transform,
                                background: face.color,
                                borderColor: fi < 2 ? 'rgba(0,255,102,0.5)' : fi < 4 ? 'rgba(12,175,255,0.5)' : 'rgba(255,255,255,0.15)',
                                backfaceVisibility: 'visible',
                            }}
                        />
                    ))}
                    {/* Glow core */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'radial-gradient(circle, rgba(0,255,102,0.6) 0%, transparent 70%)',
                            filter: 'blur(8px)',
                        }}
                    />
                </div>

                {/* ── Threat Vector Labels ── */}
                <div
                    ref={labelsRef}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {THREAT_LABELS.map((label, i) => {
                        // Spread labels in a loose orbit
                        const angle = (i / THREAT_LABELS.length) * 2 * Math.PI;
                        const radius = 160 + (i % 3) * 55;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius * 0.5; // flatten to ellipse
                        return (
                            <div
                                key={i}
                                className="sk-label absolute font-mono text-xs font-bold tracking-widest select-none"
                                style={{
                                    left: `calc(50% + ${x}px)`,
                                    top: `calc(50% + ${y}px)`,
                                    transform: 'translate(-50%, -50%)',
                                    color: i % 3 === 0
                                        ? 'rgba(0,255,102,0.9)'
                                        : i % 3 === 1
                                            ? 'rgba(12,175,255,0.9)'
                                            : 'rgba(255,100,100,0.9)',
                                    textShadow: `0 0 8px currentColor`,
                                    opacity: 0,
                                }}
                            >
                                ▸ {label}
                            </div>
                        );
                    })}
                </div>

                {/* ── Scanline overlay ── */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
                        zIndex: 10,
                    }}
                />

                {/* ── Center label ── */}
                <div
                    className="absolute font-mono text-[var(--color-accent)] text-xs tracking-[0.4em] uppercase opacity-60 select-none"
                    style={{ top: 'calc(50% + 180px)', left: '50%', transform: 'translateX(-50%)' }}
                >
                    THREAT LANDSCAPE
                </div>

            </div>

            {/* ── Exit black overlay (fades in at end of pin) ── */}
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-[#020202] opacity-0 pointer-events-none"
                style={{ zIndex: 20 }}
            />
        </section>
    );
};

export default ScrollKinetics;