import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const stations = [
  { title: "CSPM & Identity", desc: "Designing and enforcing least-privilege IAM, zero-trust patterns and guardrails for regulated workloads.", tags: ["AWS Organizations", "IAM", "SSO"] },
  { title: "Runtime & Container Security", desc: "Building runtime detection and prevention for K8s and containers—prioritising signals over noise.", tags: ["eBPF", "Falco", "EKS"] },
  { title: "Threat Detection & Telemetry", desc: "Curating high-fidelity detections and pipelines that turn logs into stories an IR team can act on.", tags: ["Security Hub", "SIEM", "Detections Engg"] },
  { title: "Secure Automation", desc: "Automating the 'boring but critical' chores so humans can focus on the incidents that truly matter.", tags: ["Lambda", "SSM", "IaC"] },
  { title: "Exposure Management", desc: "Continuous scanning and remediation of vulnerabilities across the full stack.", tags: ["Nessus", "Qualys", "Inspector"] },
  { title: "AppSec & Secure Coding", desc: "Integrating security into the SDLC with SAST, DAST, and secure coding practices.", tags: ["SAST/DAST", "OWASP", "SCA"] },
  { title: "GenAI Threat Defense", desc: "Using GenAI models to identify anomalies in user behavior, endpoint activity, and network traffic.", tags: ["LLM Security", "Anomaly Detection", "Behavior Analysis"] }
];

const Experience: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Horizontal Scroll Jacking for Battle Stations
    if (scrollWrapperRef.current && scrollContentRef.current) {
      // Instead of relying on gap-blind xPercent arrays, translate the entire continuous flex track length minus the viewport
      gsap.to(scrollContentRef.current, {
        x: () => -(scrollContentRef.current!.scrollWidth - window.innerWidth + 50), // 50px buffer ensures the final card clears the right-edge on mobile
        ease: "none",
        scrollTrigger: {
          trigger: scrollWrapperRef.current,
          pin: true,
          scrub: 1,
          start: "center center",
          end: () => `+=${scrollContentRef.current!.scrollWidth}`,
          invalidateOnRefresh: true, // Auto-recalculate Math if mobile orientation flips
        }
      });
    }

    // 2. Cinematic 3D Parallax Scrubbing for Risk and Learning blocks
    gsap.utils.toArray('.reveal-card').forEach((card: any) => {
      gsap.fromTo(card, 
        { autoAlpha: 0, y: 150, rotationX: -15, scale: 0.95, transformPerspective: 1000 },
        { 
          autoAlpha: 1, 
          y: 0, 
          rotationX: 0,
          scale: 1,
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            end: "top 40%",
            scrub: 1 // Ties directly to the 3D scroll mass
          }
        }
      );
    });

    // 3. Cyber Blur Decrypt scrubbing for list items
    gsap.utils.toArray('.reveal-text').forEach((text: any) => {
      gsap.fromTo(text,
        { autoAlpha: 0, x: -40, filter: "blur(10px)" },
        { 
          autoAlpha: 1, 
          x: 0, 
          filter: "blur(0px)",
          scrollTrigger: { 
            trigger: text, 
            start: "top 95%", 
            end: "top 70%",
            scrub: 1 
          }
        }
      );
    });

  }, { scope: containerRef });

  return (
    <section id="work" ref={containerRef} className="py-24 pointer-events-none relative w-full overflow-hidden">
      
      {/* Horizontal Scroll Wrapper */}
      <div ref={scrollWrapperRef} className="h-screen w-full flex flex-col justify-center overflow-hidden z-10 pointer-events-auto bg-[#020202]/30 backdrop-blur-sm border-y border-[#30363d]/50">
        <div className="w-[90%] max-w-6xl mx-auto mb-12 shrink-0">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight border-l-4 border-[var(--color-accent)] pl-6 mb-4">Security Battle Stations</h2>
          <p className="text-gray-400 text-lg md:text-xl pl-6">Scroll to explore where I harden systems <em>before</em> attackers arrive:</p>
        </div>

        <div className="w-full overflow-hidden flex items-center">
          <div ref={scrollContentRef} className="flex gap-8 px-[5vw] w-max items-stretch pb-12">
            {stations.map((s, i) => (
              <div 
                key={i}
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
        {/* Threat Model Section */}
        <div className="reveal-card bg-gradient-to-br from-[#0d1117]/90 to-black/90 border border-[var(--color-accent-cyan)]/20 rounded-2xl p-8 md:p-12 backdrop-blur-md shadow-2xl">
          <h3 className="text-2xl md:text-4xl font-black text-white mb-8 border-l-4 border-[#0CAFFF] pl-6">How I Think About Risk</h3>
          <ul className="space-y-6 text-gray-300 text-lg">
            <li className="reveal-text flex items-start">
              <span className="text-[#0CAFFF] font-bold mr-4 mt-1">01.</span>
              <div><strong className="text-white">Identity first:</strong> If an attacker compromises identity, they own your blast radius—so I prioritise hardening authentication, authorisation and path-to-prod.</div>
            </li>
            <li className="reveal-text flex items-start">
              <span className="text-[#0CAFFF] font-bold mr-4 mt-1">02.</span>
              <div><strong className="text-white">Signal over noise:</strong> More alerts ≠ more security. I design detections that map to attacker behaviours, not just misconfigurations.</div>
            </li>
            <li className="reveal-text flex items-start">
              <span className="text-[#0CAFFF] font-bold mr-4 mt-1">03.</span>
              <div><strong className="text-white">Secure-by-default:</strong> Developers should have to work <em>harder</em> to make something insecure than secure. Guardrails & golden paths &gt; manual reviews.</div>
            </li>
            <li className="reveal-text flex items-start">
              <span className="text-[#0CAFFF] font-bold mr-4 mt-1">04.</span>
              <div><strong className="text-white">Evidence-driven decisions:</strong> Whether it's a CSPM alert or a SOC playbook, the question is always: "What data proves this is happening?"</div>
            </li>
          </ul>
        </div>

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
