import { BusinessCard, CorporateInfoRow, FrameworkNode, InfrastructurePillar, MiningStep, StatItem, TimelineItem, ValuePillar } from '../types';

export const COMPANY_PROFILE = {
  name: 'FINOVATECK Mining Company',
  shortName: 'FINOVATECK',
  subtitle: 'MINING COMPANY',
  establishedDate: '2 October 2025',
  headquarters: 'Muscat, Sultanate of Oman',
  locationDetail: 'Muscat Tech & Commercial District, Sultanate of Oman',
  industry: 'Digital Assets, Bitcoin Mining & Blockchain Infrastructure',
  primaryFocus: 'Bitcoin mining and digital-asset infrastructure',
  managingDirector: 'Rayees Ahmad Bhat',
  businessModel: 'Digital-asset mining, technology infrastructure, mining-related services and strategic digital-asset operations',
  operatingTerm: 'Four years under current lease arrangement (2025–2029)',
  operatingTermDetail: 'Operations are planned under the current lease arrangement for four years, after which operations are scheduled to close.',
  seoTitle: 'FINOVATECK Mining Company | Bitcoin Mining & Digital Asset Infrastructure',
  seoDescription: 'FINOVATECK Mining Company is a Muscat-based digital-asset and Bitcoin-mining company focused on technology infrastructure, mining operations and strategic digital-asset capabilities.'
};

export const HERO_STATS: StatItem[] = [
  { value: 'EST. 2025', label: 'Founded', sublabel: '2 October 2025' },
  { value: 'MUSCAT', label: 'Headquarters', sublabel: 'Sultanate of Oman' },
  { value: '4 YEARS', label: 'Planned Operating Term', sublabel: 'Lease Arrangement' },
  { value: 'DIGITAL ASSETS', label: 'Core Industry', sublabel: 'Infrastructure Focused' },
];

export const BUSINESS_CARDS: BusinessCard[] = [
  {
    id: 'bitcoin-mining',
    number: '01',
    title: 'Bitcoin Mining',
    description: 'Technology-driven Bitcoin mining operations supported by purpose-built computing infrastructure and operational processes.',
    iconName: 'Cpu',
    features: [
      'High-density ASIC hardware deployments',
      'Continuous hash generation algorithms',
      'Real-time hash-rate load balancing',
      'Rigorous hardware lifecycle maintenance'
    ]
  },
  {
    id: 'digital-asset-infra',
    number: '02',
    title: 'Digital Asset Infrastructure',
    description: 'Infrastructure designed to support scalable digital-asset operations and technology-driven financial ecosystems.',
    iconName: 'Network',
    features: [
      'Resilient power distribution architecture',
      'Ultra-low-latency node synchronization',
      'Decentralized ledger consensus support',
      'High-throughput network connectivity'
    ]
  },
  {
    id: 'tech-infrastructure',
    number: '03',
    title: 'Technology Infrastructure',
    description: 'High-performance computing, monitoring, connectivity and infrastructure systems supporting operational reliability.',
    iconName: 'Server',
    features: [
      'Advanced thermal & air-flow engineering',
      'Automated telemetry & sensor arrays',
      'Fault-tolerant electrical substations',
      'Continuous performance telemetry'
    ]
  },
  {
    id: 'strategic-operations',
    number: '04',
    title: 'Strategic Digital Asset Operations',
    description: 'Technology and operational capabilities focused on responsible participation in the evolving digital-asset ecosystem.',
    iconName: 'ShieldCheck',
    features: [
      'Institutional operational discipline',
      'Transparent compliance standards',
      'Systematic risk mitigation protocols',
      'Structured 4-year lifecycle execution'
    ]
  }
];

export const MINING_PROCESS_STEPS: MiningStep[] = [
  {
    id: 'hardware',
    stepNumber: '01',
    title: 'Hardware',
    subtitle: 'High-Efficiency ASICs',
    description: 'Dedicated application-specific integrated circuits engineered specifically for SHA-256 computation.',
    techDetail: 'High computational density with custom microarchitecture tuned for maximum hash efficiency.',
    iconName: 'Microchip'
  },
  {
    id: 'energy',
    stepNumber: '02',
    title: 'Energy',
    subtitle: 'Power Management',
    description: 'Disciplined electrical distribution ensuring steady, uninterrupted and balanced voltage supply.',
    techDetail: 'Industrial transformers and multi-stage power units minimizing loss and harmonic distortion.',
    iconName: 'Zap'
  },
  {
    id: 'computing',
    stepNumber: '03',
    title: 'Computing',
    subtitle: 'SHA-256 Execution',
    description: 'Continuous cryptographic hashing searching for valid proof-of-work block solutions.',
    techDetail: 'Synchronized cluster controllers aggregating millions of computations per second.',
    iconName: 'Cpu'
  },
  {
    id: 'cooling',
    stepNumber: '04',
    title: 'Cooling',
    subtitle: 'Thermal Equilibrium',
    description: 'Engineered air containment and thermal dissipation maintaining peak silicon operating temperatures.',
    techDetail: 'Precision airflow channels designed for arid Middle Eastern climate resilience.',
    iconName: 'Fan'
  },
  {
    id: 'monitoring',
    stepNumber: '05',
    title: 'Monitoring',
    subtitle: 'Real-Time Telemetry',
    description: '24/7 automated sensor monitoring tracking fan speeds, temperatures, power draw, and hash rates.',
    techDetail: 'Granular device-level health checks with automated failover and alert mechanisms.',
    iconName: 'Activity'
  },
  {
    id: 'network',
    stepNumber: '06',
    title: 'Bitcoin Network',
    subtitle: 'Decentralized Consensus',
    description: 'Immediate block transmission and verification across global peer-to-peer Bitcoin nodes.',
    techDetail: 'Direct stratum protocol connection to global consensus pools with zero packet throttling.',
    iconName: 'Globe'
  }
];

export const INFRASTRUCTURE_PILLARS: InfrastructurePillar[] = [
  {
    id: 'hpc',
    title: 'High-Performance Computing',
    tagline: 'Engineered for uninterrupted high-density computation',
    description: 'Purpose-built computing infrastructure designed for continuous 24/7 operation under demanding cryptographic workloads. Every rack is optimized for thermal balance and electrical stability.',
    iconName: 'Cpu',
    specs: [
      { label: 'Workload Architecture', value: 'SHA-256 Specialized Silicon' },
      { label: 'Deployment Layout', value: 'High-Density Modular Racks' },
      { label: 'Uptime Target', value: '99.8% Availability' },
      { label: 'Operation Cycle', value: 'Continuous (24/7/365)' }
    ],
    keyPoints: [
      'Modular rack topology allowing rapid unit diagnostics without interrupting adjacent rows',
      'Optimized busbars and direct DC connections to reduce internal electrical resistance',
      'Isolated control planes preventing cascading compute interruptions'
    ]
  },
  {
    id: 'energy',
    title: 'Energy Infrastructure',
    tagline: 'Reliable and disciplined energy utilization',
    description: 'Industrial-scale power infrastructure engineered to manage high continuous electrical loads with maximum safety, power-factor correction, and thermal regulation.',
    iconName: 'Zap',
    specs: [
      { label: 'Power Quality', value: 'Regulated Industrial Three-Phase' },
      { label: 'Substation Protection', value: 'Surge Suppression & Fast-Trip Relays' },
      { label: 'Efficiency Factor', value: '>0.98 Power Factor Correction' },
      { label: 'Safety Redundancy', value: 'Dual-Circuit Isolation' }
    ],
    keyPoints: [
      'Precision step-down transformers reducing transmission loss before rack distribution',
      'Automated phase load balancing to prevent asymmetric thermal buildup',
      'Continuous power metering down to individual server distribution strips'
    ]
  },
  {
    id: 'cooling',
    title: 'Cooling Systems',
    tagline: 'Specialized thermal management for Middle Eastern climates',
    description: 'Advanced thermal engineering tailored for Muscat climatic conditions, combining hot/cold aisle isolation, high-static pressure exhaust fans, and engineered air filtration.',
    iconName: 'Fan',
    specs: [
      { label: 'Airflow Design', value: 'Hot / Cold Aisle Containment' },
      { label: 'Operating Ambient Range', value: 'Up to 50°C External Resilience' },
      { label: 'Filtration Level', value: 'Multi-Stage Particulate Scrubbing' },
      { label: 'Thermal Delta', value: '< 15°C Differential across Modules' }
    ],
    keyPoints: [
      'Negative pressure plenum extraction preventing hot exhaust recirculation',
      'Dust and particulate barrier filtration protecting delicate chip components',
      'Adaptive variable-speed fan controllers reacting to internal thermal sensors'
    ]
  },
  {
    id: 'network',
    title: 'Network Infrastructure',
    tagline: 'Sub-millisecond stratum synchronization',
    description: 'Redundant low-latency fiber connectivity engineered for uninterrupted communication with the global decentralized Bitcoin network and mining coordination layers.',
    iconName: 'Network',
    specs: [
      { label: 'Backbone Connectivity', value: 'Dual Redundant Fiber Uplinks' },
      { label: 'Internal Latency', value: '< 1.2ms Local Switch Fabric' },
      { label: 'Protocol Stack', value: 'Optimized Stratum V2 Protocol' },
      { label: 'DDoS Protection', value: 'Multi-Tier Edge Traffic Filtering' }
    ],
    keyPoints: [
      'BGP multihomed routing ensuring automated failover across primary regional carriers',
      'Isolated VLAN architecture separating management telemetry from hash submission',
      'Synchronized NTP time-servers maintaining microsecond accuracy for block propagation'
    ]
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Operations',
    tagline: 'Comprehensive real-time telemetry and automated controls',
    description: 'Unified command center infrastructure providing full-spectrum visibility into every operational metric—from individual chip core temperatures to facility-wide power draws.',
    iconName: 'Activity',
    specs: [
      { label: 'Telemetry Frequency', value: 'Sub-second Sensor Polling' },
      { label: 'Metric Coverage', value: 'Thermal, Voltage, RPM, Hashrate, Error Rate' },
      { label: 'Incident Automation', value: 'Automated Fault Isolation & Throttle' },
      { label: 'Audit Logging', value: 'Immutable Operational Time-Series Data' }
    ],
    keyPoints: [
      'Visualized thermal heatmaps highlighting micro-climates across physical racks',
      'Predictive component failure analysis identifying degrading chips prior to fault',
      'Instant mobile & dashboard alerting for critical thermal or power thresholds'
    ]
  },
  {
    id: 'security',
    title: 'Security & Integrity',
    tagline: 'Physical and digital perimeter governance',
    description: 'Multi-layered physical security combined with cryptographic access controls, ensuring continuous asset protection and corporate data integrity.',
    iconName: 'ShieldCheck',
    specs: [
      { label: 'Physical Perimeter', value: 'Biometric Access & Multi-Zone Entry' },
      { label: 'Surveillance', value: '24/7 High-Definition CCTV Recording' },
      { label: 'Network Access', value: 'Zero-Trust Architecture & Key Rotation' },
      { label: 'Compliance Audit', value: 'Continuous Internal Governance' }
    ],
    keyPoints: [
      'Zoned physical authorization restricting facility access strictly to verified personnel',
      'Hardware security modules (HSM) safeguarding administrative credentials',
      'Encrypted telemetry channels preventing unauthorized telemetry tampering'
    ]
  }
];

export const OPERATING_FRAMEWORK: FrameworkNode[] = [
  {
    number: '01',
    title: 'Infrastructure',
    role: 'Physical Foundation',
    description: 'Engineered facility housing, modular containment, and robust industrial buildout.'
  },
  {
    number: '02',
    title: 'Energy',
    role: 'Power Input',
    description: 'Stabilized three-phase electrical input with integrated protection and balance.'
  },
  {
    number: '03',
    title: 'Computing',
    role: 'Execution Core',
    description: 'High-throughput SHA-256 cryptographic hardware executing hashing algorithms.'
  },
  {
    number: '04',
    title: 'Monitoring',
    role: 'Visibility Layer',
    description: 'Real-time telemetry streams monitoring thermal, hash, and electrical variables.'
  },
  {
    number: '05',
    title: 'Optimization',
    role: 'Efficiency Tuner',
    description: 'Continuous algorithmic adjustments to voltage, clock rate, and cooling dynamics.'
  },
  {
    number: '06',
    title: 'Operations',
    role: 'Discipline & Governance',
    description: 'Systematic maintenance, scheduled lifecycle audits, and clear term execution.'
  }
];

export const TIMELINE_ITEMS: TimelineItem[] = [
  {
    date: '02 OCT 2025',
    title: 'FINOVATECK Established',
    description: 'Company established in Muscat, Sultanate of Oman with a focus on digital-asset infrastructure.',
    status: 'completed',
    details: 'Incorporation and strategic planning for institutional digital infrastructure in the Sultanate of Oman under Managing Director Rayees Ahmad Bhat.'
  },
  {
    date: '2025–2026',
    title: 'Infrastructure & Operations',
    description: 'Development and deployment of digital-asset and Bitcoin-mining computing infrastructure.',
    status: 'completed',
    details: 'Facility engineering, electrical substation commissioning, cooling system installation, and computational hardware integration.'
  },
  {
    date: 'Current',
    title: 'Operational Phase',
    description: 'Active technology infrastructure and disciplined Bitcoin mining operations.',
    status: 'current',
    details: 'Ongoing high-efficiency mining operations, continuous telemetry monitoring, and strategic participation in the digital asset ecosystem.'
  },
  {
    date: 'Planned',
    title: 'Four-Year Operating Term',
    description: 'Operations are planned under the current lease arrangement for four years, after which operations are scheduled to close.',
    status: 'planned',
    details: 'Disciplined adherence to the four-year operational charter and lease timeline, executing the full operational lifecycle through scheduled closure.'
  }
];

export const WHY_FINOVATECK: ValuePillar[] = [
  {
    title: 'Technology First',
    description: 'Infrastructure and computing capabilities at the core of operations.',
    metric: 'SHA-256',
    detail: 'Purpose-built hardware architecture optimized specifically for industrial-scale blockchain verification.'
  },
  {
    title: 'Operational Discipline',
    description: 'Structured processes designed around reliability, precision, and efficiency.',
    metric: '24/7/365',
    detail: 'Rigorous engineering procedures, preventative maintenance cycles, and strict operating protocols.'
  },
  {
    title: 'Infrastructure Focus',
    description: 'Building the physical and digital systems behind digital assets.',
    metric: 'Modular',
    detail: 'Focused entirely on the industrial computing, energy, and cooling backbone rather than financial speculation.'
  },
  {
    title: 'Strategic Perspective',
    description: 'Focused on disciplined execution within a defined operating window.',
    metric: '4-Year Term',
    detail: 'Clear, transparent 4-year operating lifecycle defined by the current lease agreement from Muscat.'
  }
];

export const CORPORATE_TRANSPARENCY_DATA: CorporateInfoRow[] = [
  { label: 'Company Name', value: 'FINOVATECK Mining Company' },
  { label: 'Established', value: '2 October 2025' },
  { label: 'Headquarters', value: 'Muscat, Sultanate of Oman' },
  { label: 'Industry', value: 'Digital Assets, Bitcoin Mining & Blockchain Infrastructure' },
  { label: 'Primary Focus', value: 'Bitcoin mining and digital-asset infrastructure' },
  { label: 'Managing Director', value: 'Rayees Ahmad Bhat' },
  { label: 'Business Model', value: 'Digital-asset mining, technology infrastructure, mining-related services and strategic digital-asset operations' },
  { label: 'Operating Term', value: 'Four years under current lease arrangement (2025–2029), after which operations are scheduled to close' },
  { label: 'Operational Model', value: 'Integrated Computing, Energy & Cooling Infrastructure' },
  { label: 'Jurisdiction', value: 'Sultanate of Oman' }
];

export const FAQ_ITEMS = [
  {
    question: 'What is the primary business focus of FINOVATECK?',
    answer: 'FINOVATECK Mining Company focuses on the physical and technology infrastructure behind digital assets—specifically high-performance Bitcoin mining, industrial computing systems, energy management, and specialized cooling operations from Muscat, Oman.'
  },
  {
    question: 'Is FINOVATECK an investment fund, exchange, or retail crypto platform?',
    answer: 'No. FINOVATECK is strictly an infrastructure and technology company. We do not provide crypto trading services, retail investment accounts, or financial yield products.'
  },
  {
    question: 'What is the planned operating timeframe for FINOVATECK?',
    answer: 'FINOVATECK operates under a structured four-year lease arrangement established on 2 October 2025, after which operations are scheduled to conclude in accordance with corporate planning.'
  },
  {
    question: 'Why is FINOVATECK headquartered in Muscat, Sultanate of Oman?',
    answer: 'Muscat provides strategic geographic positioning bridging Middle Eastern technology initiatives with global digital asset networks, supported by modern commercial infrastructure and stable utility partnerships.'
  }
];
