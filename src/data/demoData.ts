import { Severity } from '../types';

export interface ThreatProfile {
  id: string;
  name: string;
  category: string;
  severity: Severity;
  confidence: number; // 0-100
  riskScore: number;  // 0-100
  source: string;
  target: string;
  port: number;
  protocol: string;
  timestamp: string;
  detectionMethod: 'RULE' | 'ML' | 'STATISTICAL' | 'FUSED' | 'HYBRID';
  evidencePoints: string[];
  metrics: {
    mlConfidence: number;
    statisticalScore: number;
    ruleConfidence: number;
    fusedConfidence: number;
    baselineConfidence?: number;
    threatIntelConfidence?: number;
    falsePositiveProb?: number;
  };
  metadata: {
    connectionFrequency: string;
    destinationPorts: number[];
    baselineDeviation: string;
    ja3Fingerprint?: string;
    dnsEntropy?: string;
    transferBytes?: string;
  };
}

export interface AttackStoryStep {
  id: string;
  timestamp: string;
  stage: string;
  title: string;
  description: string;
  severity: Severity;
  confidence: number;
  evidence: string;
  source: string;
  target: string;
  graphNodeId: string;
}

export interface AttackStory {
  id: string;
  code: string; // e.g. "THR-1042"
  title: string;
  adversary: string;
  targetAsset: string;
  status: 'ACTIVE' | 'CONTAINED' | 'RESOLVED';
  startTime: string;
  riskScore: number;
  confidence: number;
  correlatedEventsCount: number;
  steps: AttackStoryStep[];
  aiAnalysis: string;
}

export interface SecurityPipelineStage {
  id: string;
  name: string;
  shortName: string;
  description: string;
  status: 'ACTIVE' | 'PROCESSING' | 'STANDBY';
  metricLabel: string;
  metricValue: string;
  subtext: string;
  engine: string;
}

export interface RiskFactor {
  factor: string;
  weight: number;
  score: number;
  impact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

// 1. Detection Engines Live Status
export const DETECTION_ENGINES = [
  { name: 'RULE ENGINE', status: 'ACTIVE', latency: '0.4ms', ruleCount: '1,420 Active Rules' },
  { name: 'ML ENGINE', status: 'ACTIVE', latency: '2.1ms', model: 'Isolation Forest + Autoencoder v4' },
  { name: 'STATISTICAL', status: 'ACTIVE', latency: '0.8ms', baseline: '30-Day Rolling Poisson & Z-Score' },
  { name: 'BASELINE', status: 'ACTIVE', latency: '1.2ms', drift: '0.04% Deviation Nominal' },
  { name: 'CORRELATION', status: 'ACTIVE', latency: '3.4ms', graphEngine: 'Cross-Stream Threat Graph' }
];

// 2. The 8 Core Threat Cards with Safe Demo Data & Rich Evidence
export const CORE_THREAT_PROFILES: ThreatProfile[] = [
  {
    id: 'thr-port-scan',
    name: 'Port Scanning',
    category: 'RECONNAISSANCE',
    severity: 'HIGH',
    confidence: 94,
    riskScore: 78,
    source: '192.168.10.50',
    target: '10.0.0.15 (DMZ-Nginx-01)',
    port: 445,
    protocol: 'TCP',
    timestamp: '09:42:11',
    detectionMethod: 'HYBRID',
    evidencePoints: [
      'Abnormal connection frequency (1,024 SYN probes in 1.8 seconds)',
      'Multiple destination ports sequential sweep (21, 22, 80, 443, 445, 8080)',
      'Traffic deviation from baseline (+840% above subnet normal)',
      'Related security events (3 preceding ARP sweeps from same MAC)',
      'Detection rule match: SIG-2024-PORT-SCAN-STEALTH',
      'ML anomaly score: 0.942 (Isolation Forest outlier)'
    ],
    metrics: {
      mlConfidence: 94,
      statisticalScore: 91,
      ruleConfidence: 98,
      fusedConfidence: 94
    },
    metadata: {
      connectionFrequency: '568 pkts/sec',
      destinationPorts: [21, 22, 23, 80, 443, 445, 3389, 8080],
      baselineDeviation: '+840%'
    }
  },
  {
    id: 'thr-sql-injection',
    name: 'SQL Injection',
    category: 'EXPLOITATION',
    severity: 'CRITICAL',
    confidence: 97,
    riskScore: 93,
    source: '10.0.0.15',
    target: '10.0.1.50 (Prod-DB-01)',
    port: 80,
    protocol: 'TCP / HTTP',
    timestamp: '09:42:18',
    detectionMethod: 'FUSED',
    evidencePoints: [
      'Tainted parameter injection string caught in HTTP POST body',
      'Stacked SQL query pattern detected: `UNION SELECT null, username, password_hash FROM users--`',
      'Traffic deviation from baseline (+180% response payload size)',
      'Related security events (Followed port scan within 2 minutes)',
      'Detection rule match: OWASP-A03-SQL-INJECTION-SIG',
      'ML anomaly score: 0.978 (Deep Tokenizer Sequence)'
    ],
    metrics: {
      mlConfidence: 98,
      statisticalScore: 89,
      ruleConfidence: 99,
      fusedConfidence: 97
    },
    metadata: {
      connectionFrequency: '24 req/sec',
      destinationPorts: [80, 443, 5432],
      baselineDeviation: '+640%'
    }
  },
  {
    id: 'thr-brute-force',
    name: 'Brute Force',
    category: 'CREDENTIAL_ACCESS',
    severity: 'HIGH',
    confidence: 93,
    riskScore: 82,
    source: '45.154.255.88',
    target: '10.0.1.15 (Auth-LDAP-01)',
    port: 22,
    protocol: 'TCP / SSH',
    timestamp: '09:41:55',
    detectionMethod: 'STATISTICAL',
    evidencePoints: [
      'Abnormal connection frequency (48 failed SSH PAM handshakes in 30s)',
      'Multiple user dictionary targets (root, admin, deploy, service, postgres)',
      'Traffic deviation from baseline (+420% auth failure rate)',
      'Related security events (IP listed in AbuseIPDB threat intelligence feed)',
      'Detection rule match: PAM-AUTH-BURST-THRESHOLD',
      'ML anomaly score: 0.925 (Time-series Poisson spike)'
    ],
    metrics: {
      mlConfidence: 91,
      statisticalScore: 96,
      ruleConfidence: 94,
      fusedConfidence: 93
    },
    metadata: {
      connectionFrequency: '96 attempts/min',
      destinationPorts: [22],
      baselineDeviation: '+420%'
    }
  },
  {
    id: 'thr-phishing',
    name: 'Phishing',
    category: 'INITIAL_ACCESS',
    severity: 'HIGH',
    confidence: 90,
    riskScore: 76,
    source: '91.240.118.172',
    target: '10.0.3.12 (Mail-Relay-01)',
    port: 25,
    protocol: 'TCP / SMTP',
    timestamp: '09:40:12',
    detectionMethod: 'RULE',
    evidencePoints: [
      'Spoofed SPF & DKIM record verification failed on ingress MX',
      'Weaponized attachment: `Invoice_Q3_Exp.pdf.vbs`',
      'Traffic deviation from baseline (Header domain mismatch from known vendors)',
      'Related security events (Homoglyph domain registered 48 hours ago)',
      'Detection rule match: MAIL-PHISH-SPOOF-DKIM-FAIL',
      'ML anomaly score: 0.884 (NLP body sentiment & credential request classifier)'
    ],
    metrics: {
      mlConfidence: 89,
      statisticalScore: 85,
      ruleConfidence: 96,
      fusedConfidence: 90
    },
    metadata: {
      connectionFrequency: '1 msg/sec',
      destinationPorts: [25, 587],
      baselineDeviation: '+110%'
    }
  },
  {
    id: 'thr-malware',
    name: 'Malware',
    category: 'EXECUTION',
    severity: 'CRITICAL',
    confidence: 98,
    riskScore: 95,
    source: '185.196.8.44',
    target: '10.0.4.88 (Internal-Workstation-04)',
    port: 8443,
    protocol: 'HTTPS',
    timestamp: '09:43:02',
    detectionMethod: 'FUSED',
    evidencePoints: [
      'Periodic heartbeat beacon cadence (Jitter < 5% over 12 intervals)',
      'JA3 Fingerprint `e3b0c442...` matches known Cobalt Strike malleable C2 profile',
      'Traffic deviation from baseline (Direct outbound HTTPS to uncategorized bulletproof ASN)',
      'Related security events (Followed malicious email attachment execution)',
      'Detection rule match: C2-BEACON-COBALT-JA3',
      'ML anomaly score: 0.985 (FFT spectral frequency match)'
    ],
    metrics: {
      mlConfidence: 99,
      statisticalScore: 95,
      ruleConfidence: 98,
      fusedConfidence: 98
    },
    metadata: {
      connectionFrequency: 'Every 30s (+-1.2s)',
      destinationPorts: [8443],
      baselineDeviation: '+920%',
      ja3Fingerprint: '6734f37431670e3ab4292b8f60f29984'
    }
  },
  {
    id: 'thr-dns-anomaly',
    name: 'DNS Anomaly',
    category: 'COMMAND_AND_CONTROL',
    severity: 'MEDIUM',
    confidence: 89,
    riskScore: 71,
    source: '192.168.1.25',
    target: '10.0.2.1 (Edge-Gateway-01)',
    port: 53,
    protocol: 'UDP / DNS',
    timestamp: '09:42:14',
    detectionMethod: 'ML',
    evidencePoints: [
      'High-entropy domain query bursts: `x9f2a019b88a.tunnel.cdn-sync.net`',
      'Shannon entropy score 4.82 (Substantially above benign domain distribution)',
      'Traffic deviation from baseline (TXT query size 480 bytes vs 65 byte average)',
      'Related security events (DGA domain fluxing every 180 seconds)',
      'Detection rule match: DNS-TUNNEL-DGA-ENTROPY',
      'ML anomaly score: 0.912 (Character n-gram LSTM classifier)'
    ],
    metrics: {
      mlConfidence: 93,
      statisticalScore: 88,
      ruleConfidence: 86,
      fusedConfidence: 89
    },
    metadata: {
      connectionFrequency: '42 queries/sec',
      destinationPorts: [53],
      baselineDeviation: '+340%',
      dnsEntropy: '4.82 H'
    }
  },
  {
    id: 'thr-data-exfiltration',
    name: 'Data Exfiltration',
    category: 'EXFILTRATION',
    severity: 'CRITICAL',
    confidence: 96,
    riskScore: 94,
    source: '10.0.1.50',
    target: '194.26.29.112 (Foreign Storage Dropper)',
    port: 443,
    protocol: 'TCP / TLS',
    timestamp: '09:44:20',
    detectionMethod: 'HYBRID',
    evidencePoints: [
      'Anomalous continuous outbound data stream (2.8 GB transferred in 90 seconds)',
      'Single long-lived TLS session from database server directly to foreign IP',
      'Traffic deviation from baseline (+1,400% egress bandwidth spike on DB segment)',
      'Related security events (Followed unauthorized SQL injection table dump)',
      'Detection rule match: NET-EGRESS-HIGH-VOLUME-ANOMALY',
      'ML anomaly score: 0.968 (Volume delta Z-score > 6.2)'
    ],
    metrics: {
      mlConfidence: 97,
      statisticalScore: 97,
      ruleConfidence: 94,
      fusedConfidence: 96
    },
    metadata: {
      connectionFrequency: 'Sustained 250 Mbps',
      destinationPorts: [443],
      baselineDeviation: '+1400%',
      transferBytes: '2.84 GB'
    }
  },
  {
    id: 'thr-anomalous-behavior',
    name: 'Anomalous Behavior',
    category: 'LATERAL_MOVEMENT',
    severity: 'MEDIUM',
    confidence: 87,
    riskScore: 68,
    source: '10.0.4.88',
    target: '10.0.1.15 (Auth-LDAP-01)',
    port: 389,
    protocol: 'TCP / LDAP',
    timestamp: '09:43:45',
    detectionMethod: 'STATISTICAL',
    evidencePoints: [
      'Unusual after-hours Kerberos ticket granting request sequence',
      'Workstation accessing tier-0 domain controller directly bypassing jumpbox',
      'Traffic deviation from baseline (Node never initiated LDAP binds in previous 90 days)',
      'Related security events (Workstation infected with C2 beacon 30 minutes prior)',
      'Detection rule match: BEHAVIOR-ANOMALOUS-LATERAL-BIND',
      'ML anomaly score: 0.892 (User & Entity Behavior Analytics UEBA model)'
    ],
    metrics: {
      mlConfidence: 86,
      statisticalScore: 91,
      ruleConfidence: 84,
      fusedConfidence: 87
    },
    metadata: {
      connectionFrequency: 'Burst 12 binds',
      destinationPorts: [389, 636],
      baselineDeviation: '+290%'
    }
  }
];

// 3. Complete Interactive Attack Story (THR-1042)
export const DEMO_ATTACK_STORY: AttackStory = {
  id: 'story-thr-1042',
  code: 'THR-1042',
  title: 'Multi-Stage Ingress & Database Exfiltration Campaign',
  adversary: '185.220.101.5 (Tor Exit / Autonomous Threat Actor)',
  targetAsset: 'Prod-DB-01 (10.0.1.50)',
  status: 'ACTIVE',
  startTime: '09:40 UTC',
  riskScore: 91,
  confidence: 96,
  correlatedEventsCount: 7,
  steps: [
    {
      id: 'step-1',
      timestamp: '09:40',
      stage: 'Reconnaissance',
      title: 'Reconnaissance detected',
      description: 'External host probes public DNS & perimeter edge gateway with stealth ping sweeps.',
      severity: 'LOW',
      confidence: 84,
      evidence: 'ICMP echo bursts + DNS ANY lookups across 12 domain subzones.',
      source: '185.220.101.5',
      target: 'Edge-Gateway-01 (10.0.2.1)',
      graphNodeId: 'node-recon'
    },
    {
      id: 'step-2',
      timestamp: '09:41',
      stage: 'Service Enumeration',
      title: 'Port scanning',
      description: 'TCP SYN sweep across ports 21-8080 targeting perimeter DMZ ingress reverse proxy.',
      severity: 'MEDIUM',
      confidence: 91,
      evidence: '1,024 half-open handshakes in 1.8s logged by passive Scapy sensor.',
      source: '185.220.101.5',
      target: 'DMZ-Nginx-01 (10.0.1.20)',
      graphNodeId: 'node-portscan'
    },
    {
      id: 'step-3',
      timestamp: '09:42',
      stage: 'Exploitation',
      title: 'SQL injection attempt',
      description: 'Weaponized SQL payload delivered in HTTP POST query to search API endpoint.',
      severity: 'CRITICAL',
      confidence: 97,
      evidence: "Tainted parameter `' OR 1=1--` intercepted and matched to OWASP signature.",
      source: '10.0.0.15',
      target: 'DMZ-Nginx-01 (10.0.1.20)',
      graphNodeId: 'node-sqli'
    },
    {
      id: 'step-4',
      timestamp: '09:43',
      stage: 'Initial Access',
      title: 'Suspicious login',
      description: 'Session token issued to leaked administrator account without MFA validation.',
      severity: 'HIGH',
      confidence: 89,
      evidence: 'Auth token generated from anomalous user-agent matching headless curl client.',
      source: '10.0.1.20',
      target: 'Auth-LDAP-01 (10.0.1.15)',
      graphNodeId: 'node-compromise'
    },
    {
      id: 'step-5',
      timestamp: '09:44',
      stage: 'Privilege Escalation',
      title: 'Privilege escalation',
      description: 'Session escalated from read-only analyst role to superuser via SQL DB grant bypass.',
      severity: 'CRITICAL',
      confidence: 95,
      evidence: 'Direct ALTER ROLE postgres WITH SUPERUSER intercepted by query logger.',
      source: '10.0.1.20',
      target: 'Prod-DB-01 (10.0.1.50)',
      graphNodeId: 'node-privesc'
    },
    {
      id: 'step-6',
      timestamp: '09:45',
      stage: 'Credential Access',
      title: 'Database access',
      description: 'Table dump executed on sensitive customer credentials & transaction records.',
      severity: 'CRITICAL',
      confidence: 98,
      evidence: 'Sequential read of 14,000 records from `public.users` table.',
      source: '10.0.1.20',
      target: 'Prod-DB-01 (10.0.1.50)',
      graphNodeId: 'node-database'
    },
    {
      id: 'step-7',
      timestamp: '09:46',
      stage: 'Exfiltration',
      title: 'Data transfer anomaly',
      description: 'High-volume outbound encrypted TLS egress stream initiated to foreign receiver IP.',
      severity: 'CRITICAL',
      confidence: 96,
      evidence: '2.84 GB outbound transfer in 90 seconds. Exceeds baseline by 1,400%.',
      source: '10.0.1.50',
      target: '194.26.29.112 (External C2)',
      graphNodeId: 'node-exfil'
    }
  ],
  aiAnalysis: 'ThreatWave AI correlated 7 related events across 4 network segments into an unbroken kill chain. Adversary leveraged reconnaissance to locate web application, executed SQL injection to compromise database credentials, and initiated bulk data exfiltration. Automated containment required.'
};

// 4. Horizontal Detection Pipeline Stages
export const SECURITY_PIPELINE_STAGES: SecurityPipelineStage[] = [
  {
    id: 'pipe-1',
    name: 'TRAFFIC',
    shortName: 'Network Tap',
    description: 'Ingress/Egress packets mirrored via SPAN port',
    status: 'ACTIVE',
    metricLabel: 'Throughput',
    metricValue: '4,280 pkts/s',
    subtext: 'Test Subnet Mirror',
    engine: 'Mirror Tap / SPAN'
  },
  {
    id: 'pipe-2',
    name: 'SENSOR',
    shortName: 'Passive Probe',
    description: 'Passive Scapy & tshark capture engine',
    status: 'ACTIVE',
    metricLabel: 'Ingest Rate',
    metricValue: '100% Zero-Loss',
    subtext: 'Metadata Extractor',
    engine: 'Scapy / tshark'
  },
  {
    id: 'pipe-3',
    name: 'FEATURE ENGINE',
    shortName: 'Feature Extractor',
    description: 'Flow, DNS, TLS/QUIC, Timing, Volume & Novelty',
    status: 'ACTIVE',
    metricLabel: 'Feature Vector',
    metricValue: '64 Dimensions',
    subtext: 'Real-time Vectorization',
    engine: 'Streaming Feature Store'
  },
  {
    id: 'pipe-4',
    name: 'DETECTION',
    shortName: 'Detection Layer',
    description: 'ML Anomaly, Statistical Z-Score, Rule Signature',
    status: 'ACTIVE',
    metricLabel: 'Engines Active',
    metricValue: '3 Parallel',
    subtext: 'Microsecond Inference',
    engine: 'ML + Stats + Rules'
  },
  {
    id: 'pipe-5',
    name: 'SIGNAL FUSION',
    shortName: 'Fusion & Baseline',
    description: 'Weighted Bayesian combination & 30-day baseline',
    status: 'ACTIVE',
    metricLabel: 'Fused Conf.',
    metricValue: '96.8% Avg',
    subtext: 'Drift Compensation',
    engine: 'Bayesian Fusion Core'
  },
  {
    id: 'pipe-6',
    name: 'CORRELATION',
    shortName: 'Graph Correlation',
    description: 'Multi-vector temporal & topological clustering',
    status: 'ACTIVE',
    metricLabel: 'Correlated',
    metricValue: '7 Events',
    subtext: 'Adversary Graph',
    engine: 'Graph Correlation Engine'
  },
  {
    id: 'pipe-7',
    name: 'ATTACK STORY',
    shortName: 'Attack Narrative',
    description: 'Automated reconstruction of end-to-end kill chain',
    status: 'ACTIVE',
    metricLabel: 'Active Story',
    metricValue: 'THR-1042',
    subtext: 'MITRE ATT&CK Map',
    engine: 'Narrative Synthesizer'
  },
  {
    id: 'pipe-8',
    name: 'AI INVESTIGATION',
    shortName: 'AI SOC Analyst',
    description: 'Autonomous reasoning, evidence compilation & root-cause',
    status: 'ACTIVE',
    metricLabel: 'Reasoning',
    metricValue: 'SOC Copilot',
    subtext: '99.2% Accuracy',
    engine: 'ThreatWave AI Core'
  },
  {
    id: 'pipe-9',
    name: 'RESPONSE',
    shortName: 'SOAR Containment',
    description: 'Analyst-in-the-loop playbook & firewall execution',
    status: 'ACTIVE',
    metricLabel: 'SLA Speed',
    metricValue: '< 1.4s Dispatch',
    subtext: 'Analyst Approved',
    engine: 'Automated SOAR'
  }
];

// 5. Risk Score Factors Breakdown
export const RISK_SCORE_FACTORS: RiskFactor[] = [
  { factor: 'Threat Severity', weight: 0.25, score: 95, impact: 'CRITICAL', description: 'Active critical SQL injection & data exfiltration signals present.' },
  { factor: 'Asset Criticality', weight: 0.20, score: 92, impact: 'CRITICAL', description: 'Tier-0 database containing sensitive enterprise customer data.' },
  { factor: 'Detection Confidence', weight: 0.15, score: 96, impact: 'CRITICAL', description: 'Tri-engine agreement between ML, rules, and baseline models.' },
  { factor: 'Event Correlation', weight: 0.15, score: 88, impact: 'HIGH', description: '7 distinct stages temporally correlated across network topology.' },
  { factor: 'Behavior Deviation', weight: 0.15, score: 86, impact: 'HIGH', description: 'Egress volume is +1,400% above 30-day rolling baseline.' },
  { factor: 'Potential Impact', weight: 0.10, score: 90, impact: 'CRITICAL', description: 'Regulatory, operational, and data confidentiality exposure.' }
];

// 6. Network Activity Time-Series Seed Data
export const GENERATE_NETWORK_SERIES = () => {
  const points = [];
  const now = Date.now();
  for (let i = 24; i >= 0; i--) {
    const t = new Date(now - i * 60000);
    const timeStr = t.toTimeString().substring(0, 5);
    const normal = Math.floor(2200 + Math.sin(i * 0.4) * 450 + (Math.random() * 200));
    const suspicious = Math.floor(80 + Math.sin(i * 0.8) * 40 + (Math.random() * 30));
    const threat = i === 4 || i === 3 ? Math.floor(180 + Math.random() * 60) : Math.floor(10 + Math.random() * 15);
    points.push({
      time: timeStr,
      normal,
      suspicious,
      threat,
      total: normal + suspicious + threat,
      isAnomaly: i === 3
    });
  }
  return points;
};
