import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

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

const badges = [
  { img: "https://img.shields.io/badge/Amazon_AWS-EC7211?style=for-the-badge&logo=amazon-aws&logoColor=white", link: "https://aws.amazon.com/" },
  { img: "https://img.shields.io/badge/Microsoft_Azure-0089D6?style=for-the-badge&logo=microsoft-azure&logoColor=white", link: "https://azure.microsoft.com/" },
  { img: "https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white", link: "https://kubernetes.io/" },
  { img: "https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white", link: "https://www.docker.com/" },
  { img: "https://img.shields.io/badge/Podman-892CA0?style=for-the-badge&logo=podman&logoColor=white", link: "https://podman.io/" },
  { img: "https://img.shields.io/badge/Sysdig-BDF78B?style=for-the-badge&logo=sysdig&logoColor=white", link: "https://sysdig.com/" },
  { img: "https://img.shields.io/badge/Falco-E71822?style=for-the-badge&logo=falco&logoColor=white", link: "https://falco.org/" },
  { img: "https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white", link: "https://www.terraform.io/" },
  { img: "https://img.shields.io/badge/Ansible-EE0000?style=for-the-badge&logo=ansible&logoColor=white", link: "https://www.ansible.com/" },
  { img: "https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white", link: "https://www.cloudflare.com/" },
  { img: "https://img.shields.io/badge/Snyk-4C4A73?style=for-the-badge&logo=snyk&logoColor=white", link: "https://snyk.io/" },
  { img: "https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white", link: "https://prometheus.io/" },
  { img: "https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white", link: "https://grafana.com/" },
  { img: "https://img.shields.io/badge/SentinelOne-6100FF?style=for-the-badge&logo=sentinelone&logoColor=white", link: "https://www.sentinelone.com/" },
  { img: "https://img.shields.io/badge/OpenVAS-4F4F4F?style=for-the-badge&logo=openvas&logoColor=white", link: "https://www.greenbone.net/" },
  { img: "https://img.shields.io/badge/StackRox-E31837?style=for-the-badge&logo=redhat&logoColor=white", link: "https://www.stackrox.io/" },
  { img: "https://img.shields.io/badge/VirtualBox-183A61?style=for-the-badge&logo=virtualbox&logoColor=white", link: "https://www.virtualbox.org/" },
  { img: "https://img.shields.io/badge/Datadog-632CA6?style=for-the-badge&logo=datadog&logoColor=white", link: "https://www.datadoghq.com/" },
  { img: "https://img.shields.io/badge/ELK_Stack-005571?style=for-the-badge&logo=elasticstack&logoColor=white", link: "https://www.elastic.co/" },
  { img: "https://img.shields.io/badge/Splunk-000000?style=for-the-badge&logo=splunk&logoColor=white", link: "https://www.splunk.com/" },
  { img: "https://img.shields.io/badge/Teleport-18181A?style=for-the-badge&logo=teleport&logoColor=white", link: "https://goteleport.com/" }
];

const Certifications: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // 1. Text list items progressive fade + slide
    gsap.utils.toArray('.cert-list-item').forEach((item: any, i: number) => {
      gsap.fromTo(item,
        { opacity: 0, x: -30 },
        {
          opacity: 1, 
          x: 0, 
          duration: 0.8,
          delay: (i % 8) * 0.1, // Local stagger
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // 2. Badges pop with an Apple-style spring back bounce
    gsap.utils.toArray('.badge-item').forEach((badge: any, i: number) => {
      gsap.fromTo(badge,
        { opacity: 0, scale: 0.5, y: 30 },
        {
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.8,
          delay: (i % 5) * 0.1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: badge,
            start: "top 95%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section id="certs" ref={containerRef} className="relative py-24 px-6 pointer-events-none overflow-hidden">
      {/* Dark overlay to ensure text contrasts cleanly against the bright 3D astrolabe */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent -z-10" />
      
      <div className="max-w-6xl mx-auto z-10 pointer-events-auto mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Certificates */}
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight border-l-4 border-[var(--color-accent)] pl-6 mb-8">Certifications</h2>
            <p className="text-gray-400 text-lg mb-8 pl-6">Validation of my expertise across cloud services, security methodologies, and Kubernetes architectures:</p>
            
            <ol className="pl-6 space-y-4">
              {certs.map((c, i) => (
                <li key={i} className="cert-list-item flex items-center text-gray-300 group">
                  <span className="text-[var(--color-accent)] mr-4 whitespace-nowrap opacity-50 xl:opacity-100 group-hover:opacity-100 transition-opacity">0{i+1}.</span>
                  <a href={c.link} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-accent)] focus:text-[var(--color-accent)] transition-all hover:translate-x-2 outline-none">
                    {c.name}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Ecosystem Badges */}
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight border-l-4 border-[#0CAFFF] pl-6 mb-8">Ecosystem</h2>
            <div className="flex flex-wrap gap-4 pl-6">
              {badges.map((b, i) => (
                <a key={i} href={b.link} target="_blank" rel="noopener noreferrer" className="badge-item hover:scale-110 transition-transform hover:shadow-[0_0_15px_rgba(12,175,255,0.4)] rounded">
                  <img src={b.img} alt="Technology Badge" className="h-8 md:h-10 rounded" />
                </a>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Certifications;
