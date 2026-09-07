import { 
  SecurityEvent, Incident, Asset, Vulnerability, IOC, NotificationItem, 
  RadarBlip, AttackArc, AttackChainNode, SocMetrics 
} from '../types';

export interface PipelineStep {
  step: number;
  name: string;
  detail: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED';
}

export interface DemoState {
  demoMode: boolean;
  metrics: SocMetrics;
  events: SecurityEvent[];
  incidents: Incident[];
  assets: Asset[];
  vulnerabilities: Vulnerability[];
  iocs: IOC[];
  notifications: NotificationItem[];
  radarBlips: RadarBlip[];
  attackArcs: AttackArc[];
  attackChainNodes: AttackChainNode[];
  activeIncident: Incident | null;
  aiInsight: {
    text: string;
    confidence: number;
    status: 'ACTIVE' | 'PROCESSING';
    lastAnalysis: string;
  };
  activeSimulation: {
    threatType: string | null;
    pipeline: PipelineStep[];
    currentStepIndex: number;
    isSimulating: boolean;
  };
}

// Initial Assets
const initialAssets: Asset[] = [
  { id: 'ast-1', hostname: 'Prod-DB-01', ipAddress: '10.0.1.50', assetType: 'Database', os: 'Ubuntu 22.04 LTS', status: 'CRITICAL', riskScore: 88, cpu: 74, network: '1.2 Gbps', vulnerabilitiesCount: 3, lastActivity: 'Just now' },
  { id: 'ast-2', hostname: 'DMZ-Nginx-01', ipAddress: '10.0.1.20', assetType: 'Server', os: 'Debian 12', status: 'WARNING', riskScore: 65, cpu: 58, network: '850 Mbps', vulnerabilitiesCount: 2, lastActivity: '2 mins ago' },
  { id: 'ast-3', hostname: 'Auth-LDAP-01', ipAddress: '10.0.1.15', assetType: 'Server', os: 'RHEL 9', status: 'WARNING', riskScore: 62, cpu: 42, network: '320 Mbps', vulnerabilitiesCount: 1, lastActivity: '4 mins ago' },
  { id: 'ast-4', hostname: 'Edge-Gateway-01', ipAddress: '10.0.2.1', assetType: 'Gateway', os: 'VyOS Enterprise', status: 'HEALTHY', riskScore: 24, cpu: 31, network: '2.8 Gbps', vulnerabilitiesCount: 0, lastActivity: '1 min ago' },
  { id: 'ast-5', hostname: 'Mail-Relay-01', ipAddress: '10.0.3.12', assetType: 'Server', os: 'Alpine Linux', status: 'HEALTHY', riskScore: 30, cpu: 22, network: '140 Mbps', vulnerabilitiesCount: 1, lastActivity: '10 mins ago' },
  { id: 'ast-6', hostname: 'Internal-Workstation-04', ipAddress: '10.0.4.88', assetType: 'Workstation', os: 'Windows 11 Enterprise', status: 'CRITICAL', riskScore: 84, cpu: 89, network: '45 Mbps', vulnerabilitiesCount: 4, lastActivity: '3 mins ago' }
];

// Initial Vulnerabilities
const initialVulnerabilities: Vulnerability[] = [
  { id: 'vuln-1', cveId: 'CVE-2024-3094', title: 'XZ Utils Backdoor in Liblzma Compression Library', severity: 'CRITICAL', cvssScore: 10.0, affectedAsset: 'DMZ-Nginx-01', status: 'OPEN', description: 'Malicious backdoor in upstream xz package facilitating SSH authentication bypass.', remediation: 'Downgrade to xz 5.4.6 or apply distro vendor patch immediate.' },
  { id: 'vuln-2', cveId: 'CVE-2023-48795', title: 'SSH Terrapin Prefix Truncation Attack', severity: 'HIGH', cvssScore: 7.5, affectedAsset: 'Auth-LDAP-01', status: 'OPEN', description: 'Integrity vulnerability allowing packet drops during initial SSH handshake sequence.', remediation: 'Update OpenSSH to 9.6p1 and disable ChaCha20-Poly1305 cipher.' },
  { id: 'vuln-3', cveId: 'CVE-2024-21413', title: 'Microsoft Outlook Remote Code Execution Moniker Flaw', severity: 'CRITICAL', cvssScore: 9.8, affectedAsset: 'Internal-Workstation-04', status: 'OPEN', description: 'Moniker link parsing vulnerability bypassing Protected View checks.', remediation: 'Install Microsoft KB5034763 patch across domain workstations.' },
  { id: 'vuln-4', cveId: 'CVE-2023-38606', title: 'PostgreSQL Buffer Overflow via Malformed Query', severity: 'HIGH', cvssScore: 8.4, affectedAsset: 'Prod-DB-01', status: 'IN_PROGRESS', description: 'Flaw in memory allocation during nested JSONB subqueries.', remediation: 'Apply PostgreSQL 16.2 cumulative bugfix update.' }
];

// Initial Incidents
const initialIncidents: Incident[] = [
  {
    id: 'INC-2048',
    title: 'Distributed SQL Injection & Database Exfiltration Probe',
    description: 'Adversary executed stacked SQL injection commands attempting to dump credentials from customer accounts table.',
    severity: 'CRITICAL',
    status: 'INVESTIGATING',
    sourceIp: '185.220.101.5',
    targetAsset: 'Prod-DB-01 (10.0.1.50)',
    assignedTo: 'SecOps AI Copilot',
    createdAt: new Date(Date.now() - 360000).toISOString(),
    tactics: 'Initial Access, Exploitation, Credential Access',
    recommendedAction: 'BLOCK_IP 185.220.101.5 AND ISOLATE_ASSET Prod-DB-01'
  },
  {
    id: 'INC-2047',
    title: 'Multi-Vector SSH Credential Stuffing Campaign',
    description: '4,200 automated authentication attempts targeting root and service accounts within 3 minutes.',
    severity: 'HIGH',
    status: 'CONTAINED',
    sourceIp: '45.154.255.88',
    targetAsset: 'Auth-LDAP-01 (10.0.1.15)',
    assignedTo: 'Tier-2 Analyst',
    createdAt: new Date(Date.now() - 1200000).toISOString(),
    tactics: 'Credential Access, Brute Force',
    recommendedAction: 'ENFORCE_MFA AND RATE_LIMIT_PORT 22'
  }
];

// Initial Events
const initialEvents: SecurityEvent[] = [
  { id: 'ev-1', timestamp: '20:54:21', sourceIp: '185.220.101.5', destinationIp: '10.0.1.50', port: 80, protocol: 'TCP', attackType: 'SQL Injection', severity: 'CRITICAL', confidence: 0.96, description: "Tainted parameter `' OR 1=1--` caught on auth endpoint", category: 'WEB' },
  { id: 'ev-2', timestamp: '20:54:19', sourceIp: '45.154.255.88', destinationIp: '10.0.1.15', port: 22, protocol: 'TCP', attackType: 'SSH Brute Force', severity: 'HIGH', confidence: 0.93, description: '18 failed login attempts in 12s on PAM auth layer', category: 'AUTHENTICATION' },
  { id: 'ev-3', timestamp: '20:54:16', sourceIp: '103.251.167.20', destinationIp: '10.0.1.20', port: 445, protocol: 'TCP', attackType: 'Port Scan', severity: 'MEDIUM', confidence: 0.88, description: 'Nmap aggressive TCP stealth scan across ports 21-8080', category: 'NETWORK' },
  { id: 'ev-4', timestamp: '20:54:12', sourceIp: '185.196.8.44', destinationIp: '10.0.4.88', port: 8443, protocol: 'HTTPS', attackType: 'C2 Beaconing (Cobalt)', severity: 'CRITICAL', confidence: 0.98, description: 'Encrypted heartbeat beacon matching Cobalt Strike malleable C2 profile', category: 'MALWARE' },
  { id: 'ev-5', timestamp: '20:53:58', sourceIp: '91.240.118.172', destinationIp: '10.0.3.12', port: 25, protocol: 'SMTP', attackType: 'Phishing Payload Delivery', severity: 'HIGH', confidence: 0.91, description: 'Spoofed SPF/DKIM header delivering weaponized macro PDF invoice', category: 'PHISHING' },
  { id: 'ev-6', timestamp: '20:53:40', sourceIp: '194.26.29.112', destinationIp: '10.0.2.1', port: 443, protocol: 'UDP', attackType: 'DDoS SYN Flood', severity: 'HIGH', confidence: 0.92, description: 'High-volume SYN flood consuming 62,000 packets per second', category: 'NETWORK' }
];

// Initial IOCs
const initialIocs: IOC[] = [
  { id: 'ioc-1', value: '185.220.101.5', type: 'IP', threatScore: 98, reputation: 'MALICIOUS', country: 'Germany', organization: 'Tor Exit Node / Bulletproof', firstSeen: '2026-03-01', associatedThreats: 'SQL Injection, Account Takeover' },
  { id: 'ioc-2', value: '45.154.255.88', type: 'IP', threatScore: 92, reputation: 'MALICIOUS', country: 'Russia', organization: 'HostKey B.V.', firstSeen: '2026-03-04', associatedThreats: 'SSH Credential Stuffing, Brute Force' },
  { id: 'ioc-3', value: 'auth-verify-security-portal.com', type: 'DOMAIN', threatScore: 95, reputation: 'MALICIOUS', country: 'Netherlands', organization: 'Phishing Fast-Flux DNS', firstSeen: '2026-03-06', associatedThreats: 'Credential Harvesting, Office 365 Phishing' },
  { id: 'ioc-4', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', type: 'HASH', threatScore: 99, reputation: 'MALICIOUS', country: 'Global', organization: 'Cobalt Strike Loader', firstSeen: '2026-02-18', associatedThreats: 'Ransomware Precursor, Memory Injection' }
];

// Initial Attack Chain Nodes
const initialChainNodes: AttackChainNode[] = [
  { id: 'node-1', name: 'ATTACKER', stage: 'Adversary Infrastructure', status: 'ACTIVE', eventCount: 142, details: 'IP: 185.220.101.5 (Tor Exit / Autonomous Botnet)' },
  { id: 'node-2', name: 'RECON', stage: 'Reconnaissance', status: 'ACTIVE', eventCount: 86, details: 'Stealth TCP SYN sweeps against exposed perimeter ports' },
  { id: 'node-3', name: 'PORT SCAN', stage: 'Service Enumeration', status: 'ACTIVE', eventCount: 54, details: 'Probing ports 80, 443, 8080, 5432' },
  { id: 'node-4', name: 'WEB SERVER', stage: 'Target Entry Point', status: 'ACTIVE', eventCount: 48, details: 'DMZ-Nginx-01 receiving tainted HTTP parameters' },
  { id: 'node-5', name: 'SQL INJECTION', stage: 'Exploitation', status: 'ACTIVE', eventCount: 19, details: "' OR 1=1-- payload injected into auth query" },
  { id: 'node-6', name: 'DATABASE', stage: 'Privilege Access', status: 'ACTIVE', eventCount: 12, details: 'Prod-DB-01 PostgreSQL query table dump attempt' },
  { id: 'node-7', name: 'CREDENTIAL ACCESS', stage: 'Data Access', status: 'ACTIVE', eventCount: 6, details: 'Attempted read of password hashes' },
  { id: 'node-8', name: 'EXFILTRATION', stage: 'Action on Objective', status: 'CONTAINED', eventCount: 0, details: 'Halted by ThreatWave automated egress firewall rules' }
];

// Unified Demo Engine Singleton
class DemoEngine {
  private state: DemoState;
  private listeners: Array<() => void> = [];
  private tickerInterval: number | null = null;

  constructor() {
    this.state = {
      demoMode: true,
      metrics: {
        totalThreats: 1482,
        criticalThreats: 14,
        activeIncidents: 2,
        blockedIps: 18,
        aiDetections: 54,
        assetsMonitored: 6,
        vulnerabilities: 4,
        securityScore: 87
      },
      events: initialEvents,
      incidents: initialIncidents,
      assets: initialAssets,
      vulnerabilities: initialVulnerabilities,
      iocs: initialIocs,
      notifications: [
        { id: 'notif-1', title: 'CRITICAL: SQL Injection Detected', message: '185.220.101.5 targeted Prod-DB-01 via DMZ-Nginx-01.', severity: 'CRITICAL', timestamp: '20:54', read: false, type: 'CRITICAL_THREAT' },
        { id: 'notif-2', title: 'AI ANOMALY: Authentication Burst', message: '45.154.255.88 exceeded failed threshold by 340%.', severity: 'HIGH', timestamp: '20:54', read: false, type: 'AI_ANOMALY' }
      ],
      radarBlips: [
        { id: 'b-1', name: 'SQL Injection', angle: 45, radius: 0.75, severity: 'CRITICAL', ip: '185.220.101.5', pulsing: true },
        { id: 'b-2', name: 'SSH Brute', angle: 120, radius: 0.60, severity: 'HIGH', ip: '45.154.255.88', pulsing: true },
        { id: 'b-3', name: 'Port Scan', angle: 210, radius: 0.85, severity: 'MEDIUM', ip: '103.251.167.20', pulsing: false },
        { id: 'b-4', name: 'Cobalt C2', angle: 295, radius: 0.40, severity: 'CRITICAL', ip: '185.196.8.44', pulsing: true },
        { id: 'b-5', name: 'Phishing', angle: 340, radius: 0.55, severity: 'HIGH', ip: '91.240.118.172', pulsing: false },
        { id: 'b-6', name: 'DDoS SYN', angle: 175, radius: 0.68, severity: 'HIGH', ip: '194.26.29.112', pulsing: true }
      ],
      attackArcs: [
        { id: 'arc-1', sourceCity: 'Frankfurt', sourceCountry: 'DE', sourceCoords: [50.11, 8.68], targetCity: 'Mumbai', targetCountry: 'IN', targetCoords: [19.07, 72.87], attackType: 'SQL Injection', severity: 'CRITICAL', progress: 0.1 },
        { id: 'arc-2', sourceCity: 'Saint Petersburg', sourceCountry: 'RU', sourceCoords: [59.93, 30.33], targetCity: 'Singapore', targetCountry: 'SG', targetCoords: [1.35, 103.81], attackType: 'SSH Brute Force', severity: 'HIGH', progress: 0.4 },
        { id: 'arc-3', sourceCity: 'Amsterdam', sourceCountry: 'NL', sourceCoords: [52.36, 4.90], targetCity: 'New Delhi', targetCountry: 'IN', targetCoords: [28.61, 77.20], attackType: 'DDoS Flood', severity: 'HIGH', progress: 0.7 },
        { id: 'arc-4', sourceCity: 'Bucharest', sourceCountry: 'RO', sourceCoords: [44.42, 26.10], targetCity: 'London', targetCountry: 'GB', targetCoords: [51.50, -0.12], attackType: 'Cobalt C2', severity: 'CRITICAL', progress: 0.25 },
        { id: 'arc-5', sourceCity: 'Beijing', sourceCountry: 'CN', sourceCoords: [39.90, 116.40], targetCity: 'Tokyo', targetCountry: 'JP', targetCoords: [35.67, 139.65], attackType: 'Port Sweep', severity: 'MEDIUM', progress: 0.85 }
      ],
      attackChainNodes: initialChainNodes,
      activeIncident: initialIncidents[0],
      aiInsight: {
        text: 'AI correlated multi-vector telemetry. High confidence SQL injection detected against Prod-DB-01. Automated firewall mitigation recommended.',
        confidence: 96,
        status: 'ACTIVE',
        lastAnalysis: 'Just now'
      },
      activeSimulation: {
        threatType: null,
        pipeline: [],
        currentStepIndex: 0,
        isSimulating: false
      }
    };

    this.startAutoTicker();
  }

  public getState(): DemoState {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(listener => listener());
  }

  public toggleDemoMode(enabled?: boolean): boolean {
    this.state.demoMode = enabled !== undefined ? enabled : !this.state.demoMode;
    if (this.state.demoMode) {
      this.startAutoTicker();
    } else {
      this.stopAutoTicker();
    }
    this.notify();
    return this.state.demoMode;
  }

  private startAutoTicker(): void {
    if (this.tickerInterval) clearInterval(this.tickerInterval);
    this.tickerInterval = window.setInterval(() => {
      if (!this.state.demoMode || this.state.activeSimulation.isSimulating) return;
      this.generateSyntheticTickEvent();
    }, 4000);
  }

  private stopAutoTicker(): void {
    if (this.tickerInterval) {
      clearInterval(this.tickerInterval);
      this.tickerInterval = null;
    }
  }

  // Generate continuous background synthetic threat event
  private generateSyntheticTickEvent(): void {
    const templates = [
      { attackType: 'SQL Injection', src: '185.220.101.5', dst: '10.0.1.50', port: 80, proto: 'TCP', sev: 'CRITICAL', conf: 0.96, desc: "Tainted parameter `' OR 1=1--` intercepted by WAF filter", cat: 'WEB' },
      { attackType: 'SSH Brute Force', src: '45.154.255.88', dst: '10.0.1.15', port: 22, proto: 'TCP', sev: 'HIGH', conf: 0.94, desc: 'Repeated root authentication failures over SSH', cat: 'AUTHENTICATION' },
      { attackType: 'Port Scan', src: '103.251.167.20', dst: '10.0.1.20', port: 445, proto: 'TCP', sev: 'MEDIUM', conf: 0.86, desc: 'SYN sweep across destination range', cat: 'NETWORK' },
      { attackType: 'DDoS SYN Flood', src: '194.26.29.112', dst: '10.0.2.1', port: 443, proto: 'TCP', sev: 'HIGH', conf: 0.91, desc: 'Excessive half-open connection requests', cat: 'NETWORK' },
      { attackType: 'Phishing Domain Probe', src: '91.240.118.172', dst: '10.0.3.12', port: 25, proto: 'SMTP', cat: 'PHISHING', sev: 'HIGH', conf: 0.89, desc: 'Inbound message with spoofed authentication header' },
      { attackType: 'C2 Beacon Pulse', src: '185.196.8.44', dst: '10.0.4.88', port: 8443, proto: 'HTTPS', cat: 'MALWARE', sev: 'CRITICAL', conf: 0.98, desc: 'Periodic beacon payload matching Cobalt Strike signature' }
    ];

    const pick = templates[Math.floor(Math.random() * templates.length)];
    const timeStr = new Date().toTimeString().substring(0, 8);

    const newEv: SecurityEvent = {
      id: `ev-${Date.now()}`,
      timestamp: timeStr,
      sourceIp: pick.src,
      destinationIp: pick.dst,
      port: pick.port,
      protocol: pick.proto as any,
      attackType: pick.attackType,
      severity: pick.sev as any,
      confidence: pick.conf,
      description: pick.desc,
      category: pick.cat as any
    };

    // Prepend event
    this.state.events = [newEv, ...this.state.events.slice(0, 24)];
    this.state.metrics.totalThreats += 1;
    if (pick.sev === 'CRITICAL') {
      this.state.metrics.criticalThreats += 1;
      this.state.metrics.securityScore = Math.max(30, this.state.metrics.securityScore - 1);
    }

    this.notify();
  }

  // ========================================================================
  // UNIFIED 6 CORE THREATS & FULL ATTACK STORY SIMULATION PIPELINE
  // ========================================================================
  public async simulateAttack(threatType: string): Promise<void> {
    const isFullStory = threatType === 'FULL_ATTACK_STORY';

    const pipelineSteps: PipelineStep[] = isFullStory ? [
      { step: 1, name: 'RECONNAISSANCE', detail: 'Adversary OSINT & external perimeter host enumeration', status: 'RUNNING' },
      { step: 2, name: 'PORT SCANNING', detail: 'Stealth TCP SYN sweeps against DMZ ports (22, 80, 443, 8080)', status: 'PENDING' },
      { step: 3, name: 'BOTNET C2', detail: 'Encrypted C2 beaconing initiated to foreign command node', status: 'PENDING' },
      { step: 4, name: 'DNS / DGA ANOMALY', detail: 'High-entropy Domain Generation Algorithm (DGA) query bursts', status: 'PENDING' },
      { step: 5, name: 'MALICIOUS ENCRYPTED SESSION', detail: 'Anomalous TLS session with mismatched JA3/JA3S fingerprint', status: 'PENDING' },
      { step: 6, name: 'DATA EXFILTRATION', detail: 'Unauthorized 2.4 GB egress stream intercepted on edge gateway', status: 'PENDING' },
      { step: 7, name: 'AI CORRELATION', detail: 'ThreatWave neural model correlates cross-log telemetry into attack chain', status: 'PENDING' },
      { step: 8, name: 'THREATWAVE ATTACK STORY', detail: 'Comprehensive multi-stage intrusion narrative reconstructed', status: 'PENDING' },
      { step: 9, name: 'INCIDENT', detail: 'Tier-1 Critical Incident INC-9001 created & dispatched to SOC queue', status: 'PENDING' },
      { step: 10, name: 'RESOLUTION', detail: 'Autonomous SOAR firewall rule executed, IP blocked, asset restored', status: 'PENDING' }
    ] : [
      { step: 1, name: 'THREAT OCCURS', detail: `Simulating ${threatType.replace(/_/g, ' ')} payload ingress`, status: 'RUNNING' },
      { step: 2, name: 'EVENT GENERATED', detail: 'Packet captured & recorded in telemetry stream', status: 'PENDING' },
      { step: 3, name: 'DETECTION ENGINE', detail: 'Heuristic rules & anomaly filters triggered', status: 'PENDING' },
      { step: 4, name: 'THREAT CLASSIFICATION', detail: 'Pattern matched to MITRE ATT&CK taxonomy', status: 'PENDING' },
      { step: 5, name: 'RISK SCORE IMPACT', detail: 'Re-evaluating enterprise posture score', status: 'PENDING' },
      { step: 6, name: 'AI ANALYSIS', detail: 'Deep learning correlation & IOC cross-referencing', status: 'PENDING' },
      { step: 7, name: 'ALERT DISPATCH', detail: 'High-priority notification generated', status: 'PENDING' },
      { step: 8, name: 'INCIDENT CREATION', detail: 'Automated ticket logged in SOC queue', status: 'PENDING' },
      { step: 9, name: 'THREAT GRAPH & TIMELINE', detail: 'Attacker node & kill chain updated', status: 'PENDING' },
      { step: 10, name: 'RESPONSE RECOMMENDATION', detail: 'SOAR playbook ready: Containment suggested', status: 'PENDING' },
      { step: 11, name: 'CONTAINMENT', detail: 'Executing automated firewall rule drop', status: 'PENDING' },
      { step: 12, name: 'INCIDENT RESOLVED', detail: 'Threat neutralized & risk score recovered', status: 'PENDING' }
    ];

    this.state.activeSimulation = {
      threatType,
      pipeline: pipelineSteps,
      currentStepIndex: 0,
      isSimulating: true
    };
    this.notify();

    // Step-by-step pipeline execution
    for (let i = 0; i < pipelineSteps.length; i++) {
      this.state.activeSimulation.currentStepIndex = i;
      pipelineSteps[i].status = 'RUNNING';
      this.notify();

      await new Promise(resolve => setTimeout(resolve, isFullStory ? 800 : 600));

      const timeStr = new Date().toTimeString().substring(0, 8);

      if (isFullStory) {
        // FULL ATTACK STORY STEP LOGIC
        switch (i) {
          case 0: { // RECONNAISSANCE
            const ev: SecurityEvent = {
              id: `story-ev-1-${Date.now()}`,
              timestamp: timeStr,
              sourceIp: '185.220.101.5',
              destinationIp: '10.0.1.20',
              port: 80,
              protocol: 'TCP',
              attackType: 'Reconnaissance / Subnet Sweep',
              severity: 'LOW',
              confidence: 0.82,
              description: 'External adversary probing public DNS & perimeter gateways',
              category: 'NETWORK'
            };
            this.state.events = [ev, ...this.state.events.slice(0, 24)];
            this.state.metrics.totalThreats += 1;
            this.state.radarBlips.push({
              id: `radar-recon-${Date.now()}`,
              name: 'Reconnaissance',
              angle: 30,
              radius: 0.9,
              severity: 'LOW',
              ip: '185.220.101.5',
              pulsing: true
            });
            break;
          }
          case 1: { // PORT SCANNING
            const ev: SecurityEvent = {
              id: `story-ev-2-${Date.now()}`,
              timestamp: timeStr,
              sourceIp: '185.220.101.5',
              destinationIp: '10.0.1.20',
              port: 445,
              protocol: 'TCP',
              attackType: 'Reconnaissance / Port Scanning',
              severity: 'MEDIUM',
              confidence: 0.89,
              description: 'SYN sweep across 1,024 ports targeting DMZ-Nginx-01',
              category: 'NETWORK'
            };
            this.state.events = [ev, ...this.state.events.slice(0, 24)];
            this.state.metrics.totalThreats += 1;
            this.state.metrics.securityScore = Math.max(30, this.state.metrics.securityScore - 3);
            this.state.attackChainNodes[1].status = 'ACTIVE';
            this.state.attackChainNodes[2].status = 'ACTIVE';
            break;
          }
          case 2: { // BOTNET C2
            const ev: SecurityEvent = {
              id: `story-ev-3-${Date.now()}`,
              timestamp: timeStr,
              sourceIp: '185.196.8.44',
              destinationIp: '10.0.4.88',
              port: 8443,
              protocol: 'HTTPS',
              attackType: 'Botnet C2 Beaconing',
              severity: 'CRITICAL',
              confidence: 0.97,
              description: 'Encrypted malleable C2 heartbeat established to Russian bulletproof hosting',
              category: 'MALWARE'
            };
            this.state.events = [ev, ...this.state.events.slice(0, 24)];
            this.state.metrics.totalThreats += 1;
            this.state.metrics.criticalThreats += 1;
            this.state.metrics.securityScore = Math.max(30, this.state.metrics.securityScore - 8);
            this.state.attackArcs.push({
              id: `arc-c2-${Date.now()}`,
              sourceCity: 'Moscow',
              sourceCountry: 'RU',
              sourceCoords: [55.75, 37.61],
              targetCity: 'Mumbai',
              targetCountry: 'IN',
              targetCoords: [19.07, 72.87],
              attackType: 'Botnet C2 Beacon',
              severity: 'CRITICAL',
              progress: 0.2
            });
            break;
          }
          case 3: { // DNS / DGA ANOMALY
            const ev: SecurityEvent = {
              id: `story-ev-4-${Date.now()}`,
              timestamp: timeStr,
              sourceIp: '10.0.4.88',
              destinationIp: '10.0.2.1',
              port: 53,
              protocol: 'UDP',
              attackType: 'DGA / DNS Tunnelling',
              severity: 'HIGH',
              confidence: 0.94,
              description: 'High entropy DNS query stream matching domain generation algorithm',
              category: 'NETWORK'
            };
            this.state.events = [ev, ...this.state.events.slice(0, 24)];
            this.state.metrics.totalThreats += 1;
            this.state.metrics.aiDetections += 1;
            break;
          }
          case 4: { // MALICIOUS ENCRYPTED SESSION
            const ev: SecurityEvent = {
              id: `story-ev-5-${Date.now()}`,
              timestamp: timeStr,
              sourceIp: '10.0.4.88',
              destinationIp: '185.196.8.44',
              port: 443,
              protocol: 'HTTPS',
              attackType: 'Malicious Encrypted Session',
              severity: 'CRITICAL',
              confidence: 0.98,
              description: 'JA3 fingerprint 51c64c77e60f3980 mismatches browser profile; encrypted C2 tunnel',
              category: 'MALWARE'
            };
            this.state.events = [ev, ...this.state.events.slice(0, 24)];
            this.state.metrics.totalThreats += 1;
            this.state.metrics.criticalThreats += 1;
            this.state.attackChainNodes[3].status = 'ACTIVE';
            this.state.attackChainNodes[4].status = 'ACTIVE';
            break;
          }
          case 5: { // DATA EXFILTRATION
            const ev: SecurityEvent = {
              id: `story-ev-6-${Date.now()}`,
              timestamp: timeStr,
              sourceIp: '10.0.1.50',
              destinationIp: '185.220.101.5',
              port: 443,
              protocol: 'TCP',
              attackType: 'Data Exfiltration',
              severity: 'CRITICAL',
              confidence: 0.99,
              description: 'Active 2.4 GB encrypted database dump stream outbound to 185.220.101.5',
              category: 'WEB'
            };
            this.state.events = [ev, ...this.state.events.slice(0, 24)];
            this.state.metrics.totalThreats += 1;
            this.state.metrics.criticalThreats += 1;
            this.state.metrics.securityScore = Math.max(25, this.state.metrics.securityScore - 12);
            this.state.attackChainNodes[6].status = 'ACTIVE';
            this.state.attackChainNodes[7].status = 'ACTIVE';
            break;
          }
          case 6: { // AI CORRELATION
            this.state.aiInsight = {
              text: 'ThreatWave AI correlated 6 disparate threat vectors across DMZ and Database tiers into an APT-grade intrusion campaign. Attacker IP 185.220.101.5 linked to Cobalt C2 infrastructure.',
              confidence: 99,
              status: 'ACTIVE',
              lastAnalysis: 'Just now'
            };
            this.state.metrics.aiDetections += 2;
            break;
          }
          case 7: { // THREATWAVE ATTACK STORY
            const storyNotif: NotificationItem = {
              id: `notif-story-${Date.now()}`,
              title: '🔴 THREATWAVE ATTACK STORY: Full Chain Reconstructed',
              message: 'Reconnaissance → Port Scanning → Botnet C2 → DGA → Encrypted Session → Data Exfiltration confirmed by AI model.',
              severity: 'CRITICAL',
              timestamp: new Date().toTimeString().substring(0, 5),
              read: false,
              type: 'CRITICAL_THREAT'
            };
            this.state.notifications = [storyNotif, ...this.state.notifications];
            break;
          }
          case 8: { // INCIDENT
            const newInc: Incident = {
              id: 'INC-9001',
              title: 'APT-Grade Multi-Vector Campaign: Exfiltration & C2 Tunneling',
              description: 'Adversary leveraged Reconnaissance and Port Scanning to infiltrate DMZ, establish Botnet C2, and trigger Data Exfiltration.',
              severity: 'CRITICAL',
              status: 'INVESTIGATING',
              sourceIp: '185.220.101.5',
              targetAsset: 'Prod-DB-01 (10.0.1.50)',
              assignedTo: 'ThreatWave Autonomous SOAR Copilot',
              createdAt: new Date().toISOString(),
              tactics: 'Reconnaissance, Initial Access, Command & Control, Exfiltration',
              recommendedAction: 'BLOCK_IP 185.220.101.5 AND ISOLATE_ASSET Prod-DB-01'
            };
            this.state.incidents = [newInc, ...this.state.incidents];
            this.state.activeIncident = newInc;
            this.state.metrics.activeIncidents += 1;
            break;
          }
          case 9: { // RESOLUTION
            this.state.metrics.blockedIps += 1;
            if (this.state.activeIncident) {
              this.state.activeIncident.status = 'RESOLVED';
            }
            this.state.attackChainNodes = this.state.attackChainNodes.map(n => ({ ...n, status: 'CONTAINED' }));
            this.state.metrics.activeIncidents = Math.max(0, this.state.metrics.activeIncidents - 1);
            this.state.metrics.criticalThreats = Math.max(0, this.state.metrics.criticalThreats - 2);
            this.state.metrics.securityScore = Math.min(95, this.state.metrics.securityScore + 18);

            const resNotif: NotificationItem = {
              id: `notif-res-${Date.now()}`,
              title: '🟢 RESOLUTION: ThreatWave Full Attack Chain Neutralized',
              message: 'Autonomous SOAR isolated Prod-DB-01, blocked 185.220.101.5, revoked compromised session tokens, and restored enterprise security score.',
              severity: 'LOW',
              timestamp: new Date().toTimeString().substring(0, 5),
              read: false,
              type: 'RESPONSE_SUCCESS'
            };
            this.state.notifications = [resNotif, ...this.state.notifications];
            break;
          }
        }
      } else {
        // STANDARD 6 CORE THREAT PIPELINE LOGIC
        if (i === 1) {
          const categoryMap: Record<string, 'NETWORK' | 'WEB' | 'AUTHENTICATION' | 'MALWARE' | 'PHISHING'> = {
            DDOS: 'NETWORK',
            BOTNET_C2: 'MALWARE',
            DGA_DNS_TUNNEL: 'NETWORK',
            MALICIOUS_ENCRYPTED_SESSION: 'MALWARE',
            RECON_PORT_SCAN: 'NETWORK',
            DATA_EXFILTRATION: 'WEB',
            PORT_SCAN: 'NETWORK',
            BRUTE_FORCE: 'AUTHENTICATION',
            SQL_INJECTION: 'WEB',
            PHISHING: 'PHISHING',
            MALWARE: 'MALWARE'
          };

          const newEv: SecurityEvent = {
            id: `sim-ev-${Date.now()}`,
            timestamp: timeStr,
            sourceIp: threatType.includes('PHISH') ? 'auth-verify-portal.net' : (threatType.includes('C2') ? '185.196.8.44' : '185.220.101.5'),
            destinationIp: '10.0.1.50',
            port: threatType.includes('DNS') ? 53 : (threatType.includes('PORT') ? 445 : (threatType.includes('SQL') ? 80 : 443)),
            protocol: threatType.includes('DDOS') || threatType.includes('DNS') ? 'UDP' : 'TCP',
            attackType: threatType.replace(/_/g, ' '),
            severity: 'CRITICAL',
            confidence: 0.98,
            description: `SIMULATION: ${threatType.replace(/_/g, ' ')} detected across ingress telemetry sensors`,
            category: categoryMap[threatType] || 'NETWORK'
          };
          this.state.events = [newEv, ...this.state.events.slice(0, 24)];
          this.state.metrics.totalThreats += 1;
          this.state.metrics.criticalThreats += 1;
        }

        if (i === 4) {
          this.state.metrics.securityScore = Math.max(35, this.state.metrics.securityScore - 6);
        }

        if (i === 5) {
          this.state.aiInsight = {
            text: `ThreatWave AI confirmed ${threatType.replace(/_/g, ' ')} pattern with 98% confidence. Automated containment recommended.`,
            confidence: 98,
            status: 'ACTIVE',
            lastAnalysis: 'Just now'
          };
          this.state.metrics.aiDetections += 1;
        }

        if (i === 6) {
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: `🔴 CRITICAL: ${threatType.replace(/_/g, ' ')} Detected!`,
            message: `Adversary actively executing ${threatType.replace(/_/g, ' ')} against infrastructure assets.`,
            severity: 'CRITICAL',
            timestamp: new Date().toTimeString().substring(0, 5),
            read: false,
            type: 'CRITICAL_THREAT'
          };
          this.state.notifications = [newNotif, ...this.state.notifications];
        }

        if (i === 7) {
          const newInc: Incident = {
            id: `INC-${Math.floor(2050 + Math.random() * 100)}`,
            title: `Active ${threatType.replace(/_/g, ' ')} Incident`,
            description: `Simulated attack demonstrating autonomous pipeline for ${threatType.replace(/_/g, ' ')}.`,
            severity: 'CRITICAL',
            status: 'INVESTIGATING',
            sourceIp: '185.220.101.5',
            targetAsset: 'Prod-DB-01 (10.0.1.50)',
            assignedTo: 'ThreatWave SOAR Copilot',
            createdAt: new Date().toISOString(),
            tactics: 'Initial Access, Exploitation',
            recommendedAction: 'BLOCK_IP 185.220.101.5'
          };
          this.state.incidents = [newInc, ...this.state.incidents];
          this.state.activeIncident = newInc;
          this.state.metrics.activeIncidents += 1;
        }

        if (i === 8) {
          this.state.attackChainNodes = this.state.attackChainNodes.map(node => {
            if (node.name.includes(threatType.substring(0, 4))) {
              return { ...node, status: 'ACTIVE', eventCount: node.eventCount + 1 };
            }
            return node;
          });
        }

        if (i === 10) {
          this.state.metrics.blockedIps += 1;
        }

        if (i === 11) {
          if (this.state.activeIncident) {
            this.state.activeIncident.status = 'RESOLVED';
          }
          this.state.metrics.activeIncidents = Math.max(0, this.state.metrics.activeIncidents - 1);
          this.state.metrics.criticalThreats = Math.max(0, this.state.metrics.criticalThreats - 1);
          this.state.metrics.securityScore = Math.min(96, this.state.metrics.securityScore + 8);

          this.state.notifications = [
            {
              id: `notif-res-${Date.now()}`,
              title: `🟢 RESPONSE SUCCESS: ${threatType.replace(/_/g, ' ')} Contained`,
              message: `Firewall rules enforced. Asset restored to HEALTHY status.`,
              severity: 'LOW',
              timestamp: new Date().toTimeString().substring(0, 5),
              read: false,
              type: 'RESPONSE_SUCCESS'
            },
            ...this.state.notifications
          ];
        }
      }

      pipelineSteps[i].status = 'COMPLETED';
      this.notify();
    }

    this.state.activeSimulation.isSimulating = false;
    this.notify();
  }

  // Execute SOAR response action manually
  public executeResponseAction(action: string, target: string): void {
    if (action.toLowerCase().includes('block')) {
      this.state.metrics.blockedIps += 1;
      this.state.metrics.criticalThreats = Math.max(0, this.state.metrics.criticalThreats - 1);
      this.state.metrics.securityScore = Math.min(98, this.state.metrics.securityScore + 4);
    } else if (action.toLowerCase().includes('isolate')) {
      this.state.assets = this.state.assets.map(a => 
        a.hostname.includes(target) ? { ...a, status: 'HEALTHY', riskScore: 20 } : a
      );
      this.state.metrics.securityScore = Math.min(98, this.state.metrics.securityScore + 5);
    }

    if (this.state.activeIncident) {
      this.state.activeIncident.status = 'RESOLVED';
      this.state.metrics.activeIncidents = Math.max(0, this.state.metrics.activeIncidents - 1);
    }

    const notif: NotificationItem = {
      id: `soar-${Date.now()}`,
      title: `🟢 SOAR PLAYBOOK EXECUTED: ${action}`,
      message: `Target ${target} successfully neutralized and contained. Security score recovered.`,
      severity: 'LOW',
      timestamp: new Date().toTimeString().substring(0, 5),
      read: false,
      type: 'RESPONSE_SUCCESS'
    };
    this.state.notifications = [notif, ...this.state.notifications];

    this.notify();
  }

  public markNotificationAsRead(id: string): void {
    if (id === 'all') {
      this.state.notifications = this.state.notifications.map(n => ({ ...n, read: true }));
    } else {
      this.state.notifications = this.state.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
    }
    this.notify();
  }
}

export const demoEngine = new DemoEngine();
