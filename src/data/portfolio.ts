// Portfolio content shared by sections (and by the spec band's counts).

export type Badge = {
  name: string;        // badge text + alt text
  color: string;       // hex, no '#'
  link: string;
  logo?: string;       // simple-icons slug; unknown slugs render as text-only
  logoColor?: string;
};

export const certs = [
  { name: "ISC² Certified in Cybersecurity (CC)", link: "https://www.credly.com/badges/c74071e9-8c82-41f9-97fc-4f0809057d9b" },
  { name: "AWS Certified Security – Specialty", link: "https://www.credly.com/badges/caa35793-d064-49be-8509-94685b90b26e" },
  { name: "AWS Certified Solutions Architect – Professional", link: "https://www.credly.com/badges/70f4c532-01b6-41fc-85cd-05be931b6d67" },
  { name: "AWS Certified DevOps Engineer – Professional", link: "https://www.credly.com/badges/238268f2-9296-4d38-9a97-cf2c8c87cec6" },
  { name: "CKS: Certified Kubernetes Security Specialist", link: "https://www.credly.com/badges/f4ff4177-1d50-4ba3-9387-c2c193ea1033" },
  { name: "CKA: Certified Kubernetes Administrator", link: "https://www.credly.com/badges/fff121e3-2158-4d11-bee4-7563344c9599" },
  { name: "KCNA: Kubernetes and Cloud Native Associate", link: "https://www.credly.com/badges/d257f0c3-d1c0-4bf3-be03-f49e32715e58" },
  { name: "Scrum Master & Product Owner", link: "https://badgecert.com/bc/html/profile.jsp?k=fdoihhc" }
];

export const badgeGroups: { title: string; items: Badge[] }[] = [
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

export const stations = [
  { title: "CSPM & Identity", desc: "Designing and enforcing least-privilege IAM, zero-trust patterns and guardrails for regulated workloads.", tags: ["AWS Organizations", "IAM", "SSO"] },
  { title: "Runtime & Container Security", desc: "Building runtime detection and prevention for K8s and containers—prioritising signals over noise.", tags: ["eBPF", "Falco", "EKS"] },
  { title: "Threat Detection & Telemetry", desc: "Curating high-fidelity detections and pipelines that turn logs into stories an IR team can act on.", tags: ["Security Hub", "SIEM", "Detections Engg"] },
  { title: "Secure Automation", desc: "Automating the 'boring but critical' chores so humans can focus on the incidents that truly matter.", tags: ["Lambda", "SSM", "IaC"] },
  { title: "Exposure Management", desc: "Continuous scanning and remediation of vulnerabilities across the full stack.", tags: ["Nessus", "Qualys", "Inspector"] },
  { title: "AppSec & Secure Coding", desc: "Integrating security into the SDLC with SAST, DAST, and secure coding practices.", tags: ["SAST/DAST", "OWASP", "SCA"] },
  { title: "GenAI Threat Defense", desc: "Using GenAI models to identify anomalies in user behavior, endpoint activity, and network traffic.", tags: ["LLM Security", "Anomaly Detection", "Behavior Analysis"] }
];
