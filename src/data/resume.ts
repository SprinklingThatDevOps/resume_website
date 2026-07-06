export type Position = {
  role: string
  period: string
}

export type Experience = {
  company: string
  location: string
  totalPeriod: string
  positions: Position[]
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

export type Stat = {
  value: string
  label: string
}

export const profile = {
  name: 'Brian Bauer',
  headline: 'Driving Mission Success Through Secure Cloud & DevSecOps Innovation',
  title: 'U.S. Army Program Leader · Cloud Architect · DevSecOps Engineer',
  location: 'Madison, Alabama, United States',
  phone: '(256) 698-1166',
  email: 'brianbauer007@gmail.com',
  linkedin: 'https://www.linkedin.com/in/brianbaueralabama',
  website: 'https://www.likejackbauer.com',
  verse: 'Colossians 3:23-24',
  summary:
    'Seasoned Cloud Computing and DevSecOps professional with 15+ years of experience driving innovation and excellence in software and platform engineering for the U.S. Army. Currently leading a team of DevOps Engineers pioneering a cutting-edge, cloud-based software development environment tailored for Army applications, with a focus on Zero Trust access principles that enable secure, efficient collaboration with Defense Industrial Base (DIB) mission partners.',
  summarySecondary:
    'Designs secure multi-tenant cloud and DevSecOps platform patterns across AWS GovCloud and Azure — spanning Zero Trust access, CI/CD, Infrastructure as Code, tenant onboarding, and certified pipeline capabilities — while bridging hands-on architecture with program leadership, stakeholder alignment, compliance evidence, and roadmap execution.',
}

export const stats: Stat[] = [
  { value: '15+', label: 'Years in Cloud & DevSecOps' },
  { value: 'AWS GovCloud', label: 'Army Mission Platforms' },
  { value: 'Zero Trust', label: 'Access Architecture' },
  { value: 'ISO 27001', label: 'Compliance Lead' },
]

export const topSkills = [
  'Zscaler Zero Trust Exchange',
  'Cloud Computing',
  'Solution Architecture',
]

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
      'Azure SQL',
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
      'ARM',
      'Packer',
      'PowerShell',
      'Infrastructure as Code',
    ],
  },
  {
    category: 'Security & Reliability',
    skills: [
      'Zscaler Zero Trust Exchange',
      'Zero Trust Access Design',
      'STIG-Aligned Automation',
      'ISO 27001',
      'SRE',
      'SLOs / SLAs',
      'HA / Geo-Redundant DR',
      'Observability',
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
      'Oracle',
      'Availability Groups',
      'Backup / Recovery',
      'SSIS Data Integration',
    ],
  },
]

export const experience: Experience[] = [
  {
    company: 'SAIC',
    location: 'Huntsville, Alabama',
    totalPeriod: 'Jun 2023 – Present · 3 yrs 2 mos',
    positions: [
      { role: 'Program Mgmt Sr Manager', period: 'May 2026 – Present' },
      { role: 'Program Manager', period: 'Aug 2025 – May 2026' },
      { role: 'Cloud Comp Engineer, Senior Manager', period: 'Jun 2023 – Aug 2025' },
    ],
    highlights: [
      'Lead a team of DevOps Engineers building an innovative cloud-based software development environment for Army software development, supporting embedded software delivery and secure government/industry collaboration.',
      'Architect a solution enforcing Zero Trust access principles to facilitate access for Defense Industrial Base (DIB) mission partners rather than one-off application exceptions.',
      'Served as primary architect for the SPDS platform — the cloud-hosted DevSecOps environment, multi-tenant architecture, secure account/network boundaries, and a repeatable tenant delivery model in AWS GovCloud using landing-zone concepts and Infrastructure as Code.',
      'Integrate platform capabilities across GitLab, Azure DevOps, Jira, Nexus Repository, package/container governance, CI/CD pipelines, and automated compliance evidence workflows.',
      'Coordinate roadmap, priorities, delivery risks, stakeholder expectations, cybersecurity inputs, and accreditation needs across SPDS platform workstreams.',
    ],
  },
  {
    company: 'Hexagon Asset Lifecycle Intelligence',
    location: 'Madison, Alabama',
    totalPeriod: 'Aug 2014 – Jun 2023 · 8 yrs 11 mos',
    positions: [
      {
        role: 'Senior Manager | Cloud Solutions | Site Reliability Engineering',
        period: 'Oct 2021 – Jun 2023',
      },
      { role: 'DevOps Consultant', period: 'May 2018 – Oct 2021' },
      { role: 'Database Administrator', period: 'Dec 2014 – Oct 2021' },
      { role: 'Principal MIS Analyst', period: 'Aug 2014 – Oct 2021' },
    ],
    highlights: [
      'Managed a global SRE team focused on DevOps, CI/CD, automation, Microsoft Azure cloud, Terraform, and Kubernetes; deployed global, highly available cloud applications using Infrastructure as Code and Continuous Delivery with High Availability and geo-redundant Disaster Recovery.',
      'Held the lead role in obtaining ISO 27001 compliance and rolled out the first formal Site Reliability Engineering function for the organization.',
      'Built an SRE monitoring and automation toolkit to ensure SLOs, SLAs, and reliability of a global Azure cloud service environment, and created a service readiness review process for onboarding teams onto the SRE-managed platform.',
      'As DevOps Consultant, designed CI/CD pipelines for Azure deployments from Azure DevOps and migrated teams from TFVC to Git with Pull Request workflows to accelerate feature delivery.',
      'Administered SQL Server environments (security, sizing, log shipping, backups, replication, Availability Groups, mirroring) with deep Azure SQL, IaaS, and analytics experience; led large data migrations and performed Sarbanes-Oxley (SOX) compliant security audits.',
    ],
  },
  {
    company: 'Hexagon Safety & Infrastructure',
    location: 'Madison, Alabama',
    totalPeriod: 'Apr 2007 – Oct 2014 · 7 yrs 7 mos',
    positions: [
      { role: 'Software Support Engineer', period: 'Apr 2007 – Oct 2014' },
    ],
    highlights: [
      'Troubleshot, configured, and supported the Intergraph suite of public safety products (I/CAD Suite, I/Mobile, GeoMedia Pro, Video Analyst, I/MDT) with emphasis on SQL Server, GIS, and SSIS data integration.',
      'Supported SQL Server and Oracle installation, maintenance, and administration, and created testing, QA, and training environments on Windows Server and IIS.',
      'Delivered instructor-led training for government, Army, and law enforcement end users — including train-the-trainer sessions for Morgan State University staff — and provided critical 24/7 after-hours support to public safety system administrators.',
    ],
  },
]

export const education = [
  {
    credential: "Associate's Degree, Business Administration",
    institution: 'John C. Calhoun State Community College',
    period: '1999 – 2007',
  },
  {
    credential: 'Coursework',
    institution: 'Athens State University',
    period: '2016',
  },
]

export const certifications = [
  'AWS Certified Cloud Practitioner',
  'CompTIA Security+ ce',
  'Developing Frontline Leaders Program',
]

export const professionalDevelopment = [
  'Microsoft DevOps FastTrack',
  'SQL Server Administration',
  'PowerShell Automation',
  'Site Reliability Engineering (SRE)',
]
