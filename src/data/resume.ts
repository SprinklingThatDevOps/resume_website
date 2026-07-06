export type Experience = {
  role: string
  company: string
  location: string
  period: string
  highlights: string[]
}

export type SkillGroup = {
  category: string
  skills: string[]
}

export type Highlight = {
  title: string
  description: string
}

export const profile = {
  name: 'Brian Bauer',
  title: 'Senior Technical Program Manager · Cloud Architect · DevSecOps Engineer',
  location: 'Madison / Huntsville, AL',
  phone: '(256) 698-1166',
  email: 'brianbauer007@gmail.com',
  // Replace with your public LinkedIn profile URL
  linkedin: 'https://www.linkedin.com/',
  summary:
    'Senior Technical Program Manager, Cloud Architect, and DevSecOps platform leader with defense-contractor experience delivering SPDS for Army software modernization. Designs and architects secure multi-tenant cloud and DevSecOps platform patterns across AWS GovCloud, Zero Trust access, CI/CD, Infrastructure as Code, tenant onboarding, and certified pipeline capabilities — bridging hands-on architecture with program leadership, stakeholder alignment, compliance evidence, and roadmap execution.',
}

export const pillars: Highlight[] = [
  {
    title: 'DevSecOps Platforms',
    description:
      'Secure software factory patterns, certified CI/CD pipelines, GitOps, IaC, release automation, and tenant onboarding.',
  },
  {
    title: 'Cloud Architecture',
    description:
      'AWS GovCloud, Azure, multi-tenant landing zones, account/network boundaries, and Zero Trust access patterns.',
  },
  {
    title: 'Program Leadership',
    description:
      'Roadmaps, stakeholder execution, architecture governance, accreditation alignment, and cross-team delivery.',
  },
]

export const skillGroups: SkillGroup[] = [
  {
    category: 'Cloud & Platform',
    skills: [
      'AWS GovCloud',
      'Microsoft Azure',
      'Landing Zones',
      'Multi-Tenant Platforms',
      'Kubernetes',
      'Service Platforms',
      'Cloud Operations',
    ],
  },
  {
    category: 'DevSecOps & Automation',
    skills: [
      'GitLab',
      'Azure DevOps',
      'Jira',
      'Nexus Repository',
      'CI/CD',
      'GitOps',
      'Terraform',
      'Packer',
      'PowerShell',
      'Infrastructure as Code',
    ],
  },
  {
    category: 'Security & Reliability',
    skills: [
      'Zero Trust Access Design',
      'STIG-Aligned Automation',
      'SRE',
      'SLOs',
      'HA/DR',
      'Observability',
      'Service Readiness',
      'Compliance Evidence',
    ],
  },
  {
    category: 'Data & Systems',
    skills: [
      'SQL Server',
      'Windows Server',
      'Linux / RHEL',
      'IIS',
      'Oracle Support',
      'Database Availability',
      'Backup / Recovery',
      'Performance Troubleshooting',
    ],
  },
]

export const experience: Experience[] = [
  {
    role: 'Senior Technical Program Manager',
    company: 'SAIC',
    location: 'Huntsville, AL',
    period: 'Aug 2025 – Present',
    highlights: [
      'Lead SPDS program execution as a defense contractor supporting Army software modernization, embedded software delivery, and secure government/industry collaboration.',
      'Coordinate roadmap, priorities, delivery risks, stakeholder expectations, cybersecurity inputs, accreditation needs, and cross-team execution across SPDS platform workstreams.',
      'Drive alignment between Army stakeholders, engineering teams, assurance partners, contractors, and leadership to turn mission requirements into executable platform outcomes.',
      'Oversee delivery patterns for tenant onboarding, certified DevSecOps pipeline capabilities, Zero Trust partner access, cloud operations, and secure software delivery governance.',
    ],
  },
  {
    role: 'Cloud Comp Engineer — Senior Management',
    company: 'SAIC',
    location: 'Huntsville, AL',
    period: 'Jun 2023 – Aug 2025',
    highlights: [
      'Served as primary architect for the SPDS platform, designing the cloud-hosted DevSecOps environment, multi-tenant architecture, secure account/network boundaries, and a repeatable tenant delivery model.',
      'Architected SPDS in AWS GovCloud using landing-zone concepts, Infrastructure as Code patterns, cloud governance, automation, and secure platform baselines for mission software teams.',
      'Designed scalable Defense Industrial Base partner access and on-prem hardware-in-the-loop integration patterns using Zero Trust principles rather than one-off application exceptions.',
      'Integrated platform capabilities across GitLab, Azure DevOps, Jira, Nexus Repository, package/container governance, CI/CD pipelines, and automated compliance evidence workflows.',
      'Established platform architecture direction for secure DevSecOps, certified pipeline enablement, software factory patterns, tenant onboarding, and operational repeatability.',
    ],
  },
  {
    role: 'Senior Manager — Site Reliability Engineering',
    company: 'Hexagon PPM',
    location: 'Madison, AL',
    period: '2021 – 2023',
    highlights: [
      'Managed a global SRE team focused on DevOps, CI/CD, automation, Microsoft Azure cloud operations, Terraform, Kubernetes, and production reliability.',
      'Led design and deployment of a global multi-tenant application platform using Infrastructure as Code and Continuous Delivery practices.',
      'Product Owner for a Kubernetes-based multi-tenant service platform and introduced the organization\u2019s first formal SRE function.',
      'Developed monitoring, automation, service readiness, and operational standards to improve SLO management and production ownership maturity.',
    ],
  },
  {
    role: 'DevOps Consultant',
    company: 'Hexagon PPM',
    location: 'Madison, AL',
    period: '2017 – 2021',
    highlights: [
      'Lead DevOps Engineer for globally available, business-critical cloud licensing applications.',
      'Led cloud-first patterns across CI/CD, release management, automation, zero-downtime deployment, Azure, AWS, Infrastructure as Code, and operations.',
      'Integrated Terraform Cloud into CI/CD workflows and designed pipelines for deployments to Azure and AWS from Azure DevOps.',
      'Migrated on-premise applications to Azure while improving release consistency, deployment repeatability, and operational supportability.',
    ],
  },
  {
    role: 'Database Administrator',
    company: 'Intergraph',
    location: 'Madison, AL',
    period: '2014 – 2018',
    highlights: [
      'Administered SQL Server environments including security, sizing, backups, replication, log shipping, Availability Groups, and database mirroring.',
      'Automated routine and complex procedures using custom PowerShell modules and scripts.',
      'Designed redundant systems, policies, and procedures for disaster recovery and high availability.',
    ],
  },
  {
    role: 'Software Support Engineer',
    company: 'Intergraph',
    location: 'Madison, AL',
    period: '2007 – 2014',
    highlights: [
      'Troubleshot, configured, and supported Intergraph public safety products across Windows Server, SQL Server, Oracle, IIS, SSIS, and GIS workflows.',
      'Created testing, QA, and training environments and delivered instructor-led training for government, Army, university, and law enforcement end users.',
      'Provided critical 24/7 support to public safety system administrators and supported GIS production/data-integration workflows.',
    ],
  },
]

export const education = [
  {
    credential: 'A.S., Business Administration',
    institution: 'Calhoun Community College — Huntsville, AL',
  },
]

export const certifications = [
  'CompTIA Security+ CE',
  'AWS Certified Cloud Practitioner',
]

export const professionalDevelopment = [
  'Microsoft DevOps FastTrack',
  'SQL Server Administration',
  'PowerShell Automation',
  'Customer Service Leadership',
]
