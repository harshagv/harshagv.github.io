import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Odometer from './Odometer';

gsap.registerPlugin(ScrollTrigger);

const certs = [
  { name: "ISC² Certified in Cybersecurity (CC)", link: "https://www.credly.com/badges/c74071e9-8c82-41f9-97fc-4f0809057d9b" },
  { name: "AWS Certified Security – Specialty", link: "https://www.credly.com/badges/caa35793-d064-49be-8509-94685b90b26e" },
  { name: "AWS Certified Solutions Architect – Professional", link: "https://www.credly.com/badges/70f4c532-01b6-41fc-85cd-05be931b6d67" },
  { name: "AWS Certified DevOps Engineer – Professional", link: "https://www.credly.com/badges/238268f2-9296-4d38-9a97-cf2c8c87cec6" },
  { name: "CKS: Certified Kubernetes Security Specialist", link: "https://www.credly.com/badges/f4ff4177-1d50-4ba3-9387-c2c193ea1033" },
  { name: "CKA: Certified Kubernetes Administrator", link: "https://www.credly.com/badges/fff121e3-2158-4d11-bee4-7563344c9599" },
  { name: "KCNA: Kubernetes and Cloud Native Associate", link: "https://www.credly.com/badges/d257f0c3-d1c0-4bf3-be03-f49e32715e58" },
  { name: "Scrum Master & Product Owner", link: "https://badgecert.com/bc/html/profile.jsp?k=fdoihhc" }
];

type Badge = {
  name: string;        // badge text + alt text
  color: string;       // hex, no '#'
  link: string;
  logo?: string;       // simple-icons slug; unknown slugs render as text-only
  logoColor?: string;
};

// Builds a shields.io "for-the-badge" URL. Spaces → '_', dashes → '--' (shields.io escaping).
const shield = ({ name, color, logo, logoColor = 'white' }: Badge) => {
  const label = encodeURIComponent(name.replace(/-/g, '--').replace(/ /g, '_'));
  const logoParams = logo ? `&logo=${logo}&logoColor=${logoColor}` : '';
  return `https://img.shields.io/badge/${label}-${color}?style=for-the-badge${logoParams}`;
};

const badgeGroups: { title: string; items: Badge[] }[] = [
  {
    title: "Cloud & Platform",
    items: [
      { name: "Amazon AWS", color: "EC7211", logo: "amazon-aws", link: "https://aws.amazon.com/" },
      { name: "Microsoft Azure", color: "0089D6", logo: "microsoft-azure", link: "https://azure.microsoft.com/" },
      { name: "Kubernetes", color: "326CE5", logo: "kubernetes", link: "https://kubernetes.io/" },
      { name: "Docker", color: "2496ED", logo: "docker", link: "https://www.docker.com/" },
      { name: "Terraform", color: "7B42BC", logo: "terraform", link: "https://www.terraform.io/" },
      { name: "Cloudflare", color: "F38020", logo: "cloudflare", link: "https://www.cloudflare.com/" },
    ],
  },
  {
    title: "Identity & Secrets",
    items: [
      { name: "Teleport", color: "18181A", logo: "teleport", link: "https://goteleport.com/" },
      { name: "Microsoft Entra ID", color: "0078D4", link: "https://www.microsoft.com/security/business/microsoft-entra" },
      { name: "Duo", color: "4F9A2E", link: "https://duo.com/" },
      { name: "HashiCorp Vault", color: "FFD814", logo: "vault", logoColor: "black", link: "https://www.vaultproject.io/" },
      { name: "Jamf", color: "494C50", logo: "jamf", link: "https://www.jamf.com/" },
      { name: "Intune", color: "0063B1", link: "https://www.microsoft.com/security/business/microsoft-intune" },
    ],
  },
  {
    title: "DevSecOps & AppSec",
    items: [
      { name: "Snyk", color: "4C4A73", logo: "snyk", link: "https://snyk.io/" },
      { name: "Trivy", color: "1904DA", logo: "trivy", link: "https://trivy.dev/" },
      { name: "Checkov", color: "5B3CC4", link: "https://www.checkov.io/" },
      { name: "GitHub Advanced Security", color: "181717", logo: "github", link: "https://github.com/security" },
      { name: "SonarQube", color: "4E9BCD", logo: "sonarqube", link: "https://www.sonarsource.com/products/sonarqube/" },
      { name: "Azure DevOps", color: "0078D7", link: "https://azure.microsoft.com/products/devops" },
      { name: "GitHub Actions", color: "2088FF", logo: "githubactions", link: "https://github.com/features/actions" },
      { name: "Burp Suite", color: "FF6633", logo: "burpsuite", link: "https://portswigger.net/burp" },
      { name: "OWASP ZAP", color: "00549E", logo: "owasp", link: "https://www.zaproxy.org/" },
    ],
  },
  {
    title: "Cloud & Container Security",
    items: [
      { name: "Falco", color: "E71822", logo: "falco", link: "https://falco.org/" },
      { name: "StackRox", color: "E31837", logo: "redhat", link: "https://www.stackrox.io/" },
      { name: "AWS Security Hub", color: "DD344C", link: "https://aws.amazon.com/security-hub/" },
      { name: "GuardDuty", color: "BF0816", link: "https://aws.amazon.com/guardduty/" },
      { name: "Defender for Cloud", color: "005BA1", link: "https://azure.microsoft.com/products/defender-for-cloud" },
      { name: "Aqua Security", color: "08B1D5", link: "https://www.aquasec.com/" },
      // Not on CV — re-enable only if you can speak to real use:
      // { name: "Sysdig", color: "BDF78B", logo: "sysdig", logoColor: "black", link: "https://sysdig.com/" },
    ],
  },
  {
    title: "Detection & Response",
    items: [
      { name: "CrowdStrike", color: "FC0000", logo: "crowdstrike", link: "https://www.crowdstrike.com/" },
      { name: "SentinelOne", color: "6100FF", logo: "sentinelone", link: "https://www.sentinelone.com/" },
      { name: "Splunk", color: "000000", logo: "splunk", link: "https://www.splunk.com/" },
      { name: "ELK Stack", color: "005571", logo: "elasticstack", link: "https://www.elastic.co/" },
      { name: "Microsoft Sentinel", color: "0072C6", link: "https://azure.microsoft.com/products/microsoft-sentinel" },
      { name: "Wazuh", color: "3595F9", logo: "wazuh", link: "https://wazuh.com/" },
      { name: "Zscaler", color: "0090D0", logo: "zscaler", link: "https://www.zscaler.com/" },
      { name: "Tenable Nessus", color: "00A3A1", link: "https://www.tenable.com/products/nessus" },
    ],
  },
  {
    title: "Observability",
    items: [
      { name: "Datadog", color: "632CA6", logo: "datadog", link: "https://www.datadoghq.com/" },
      { name: "Prometheus", color: "E6522C", logo: "prometheus", link: "https://prometheus.io/" },
      { name: "Grafana", color: "F46800", logo: "grafana", link: "https://grafana.com/" },
    ],
  },
  {
    title: "Languages",
    items: [
      { name: "Python", color: "3776AB", logo: "python", link: "https://www.python.org/" },
      { name: "Go", color: "00ADD8", logo: "go", link: "https://go.dev/" },
      { name: "Bash", color: "4EAA25", logo: "gnubash", link: "https://www.gnu.org/software/bash/" },
      // Not on CV — re-enable only if you can speak to real use:
      // { name: "Ansible", color: "EE0000", logo: "ansible", link: "https://www.ansible.com/" },
      // { name: "Podman", color: "892CA0", logo: "podman", link: "https://podman.io/" },
    ],
  },
];

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

    gsap.utils.toArray('.badge-item').forEach((badge: any, i: number) => {
      gsap.fromTo(badge,
        { opacity: 0, y: 80, scale: 0.4 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          // Wrap the stagger so badges further down the list don't wait seconds to appear
          delay: (i % 10) * 0.04,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: badge,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

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