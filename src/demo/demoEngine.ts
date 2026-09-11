import { 
  SecurityEvent, Incident, Asset, Vulnerability, IOC, NotificationItem, 
  RadarBlip, AttackArc, AttackChainNode, SocMetrics 
} from '../types';
import { realtimeClient, RealtimeAlert } from '../api/realtime';

export interface PipelineStep {
  step: number;
  name: string;
  detail: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED';
}

export interface DemoState {
  demoMode: boolean;
  liveLabMode: boolean;
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
    status: 'ACTIVE' | 'PROCESSING' | 'IDLE';
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

  private knownAlertIds: Set<string> = new Set();
  private liveSyncTimer: any = null;

  constructor() {
    const isDemoEnv = import.meta.env.VITE_DEMO_MODE === 'true';

    if (isDemoEnv) {
      this.state = this.getMockDemoState();
      this.startAutoTicker();
    } else {
      this.state = this.getCleanLiveState();
      realtimeClient.connect();
      this.fetchInitialLiveData();

      // Continuous 2.5s fast synchronization with Supabase/Render in LIVE MODE
      this.liveSyncTimer = setInterval(() => {
        if (this.state.liveLabMode || !this.state.demoMode) {
          this.fetchInitialLiveData();
        }
      }, 2500);
    }

    realtimeClient.onAlert((alert) => {
      if (this.state.liveLabMode) {
        this.ingestLiveAlert(alert);
      }
    });
  }

  // Returns clean state with ZERO synthetic data for LIVE MODE
  private getCleanLiveState(): DemoState {
    return {
      demoMode: false,
      liveLabMode: true,
      metrics: {
        totalThreats: 0,
        criticalThreats: 0,
        activeIncidents: 0,
        blockedIps: 0,
        aiDetections: 0,
        assetsMonitored: 0,
        vulnerabilities: 0,
        securityScore: 100
      },
      events: [],
      incidents: [],
      assets: [],
      vulnerabilities: [],
      iocs: [],
      notifications: [
        {
          id: 'live-idle',
          title: 'SYSTEM IDLE',
          message: 'No live threats detected — Sensor Active',
          severity: 'LOW',
          timestamp: 'Active',
          read: true,
          type: 'SENSOR_IDLE'
        }
      ],
      radarBlips: [],
      attackArcs: [],
      attackChainNodes: [],
      activeIncident: null,
      aiInsight: {
        text: 'No live threats detected — Sensor Active. Passively observing network traffic on monitored interface.',
        confidence: 100,
        status: 'IDLE',
        lastAnalysis: 'Passive observation active'
      },
      activeSimulation: {
        threatType: null,
        pipeline: [],
        currentStepIndex: 0,
        isSimulating: false
      }
    };
  }

  // Isolated mock state retained solely for DEMO MODE presentations
  private getMockDemoState(): DemoState {
    return {
      demoMode: true,
      liveLabMode: false,
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
      events: [...initialEvents],
      incidents: [...initialIncidents],
      assets: [...initialAssets],
      vulnerabilities: [...initialVulnerabilities],
      iocs: [...initialIocs],
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
        { id: 'arc-2', sourceCity: 'Saint Petersburg', sourceCountry: 'RU', sourceCoords: [59.93, 30.33], targetCity: 'Singapore', targetCountry: 'SG', targetCoords: [1.35, 103.81], attackType: 'SSH Brute Force', severity: 'HIGH', progress: 0.4 }
      ],
      attackChainNodes: [...initialChainNodes],
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
  }

  // Fetches genuine database records from backend/Supabase in LIVE MODE
  public async fetchInitialLiveData(): Promise<void> {
    const api = realtimeClient.getApiBaseUrl();
    try {
      // 1. Fetch real overview metrics from Supabase
      const overviewRes = await fetch(`${api}/overview`).catch(() => null);
      if (overviewRes && overviewRes.ok) {
        const data = await overviewRes.json();
        this.state.metrics.totalThreats = data.total_alerts || data.active_threats || 0;
        this.state.metrics.criticalThreats = data.critical_alerts || 0;
        this.state.metrics.activeIncidents = data.active_incidents || 0;
        this.state.metrics.assetsMonitored = data.total_devices || data.active_devices || 0;
        this.state.metrics.securityScore = Math.max(20, 100 - Math.min(80, (data.critical_alerts || 0) * 5));
      }

      // 2. Fetch real alerts from Supabase
      const alertsRes = await fetch(`${api}/alerts?limit=50`).catch(() => null);
      if (alertsRes && alertsRes.ok) {
        const alertItems = await alertsRes.json();
        if (Array.isArray(alertItems) && alertItems.length > 0) {
          // If we already had an initial baseline, check for genuine newly arrived alerts
          if (this.knownAlertIds.size > 0) {
            const newlyArrived = alertItems.filter((a: any) => !this.knownAlertIds.has(a.id));
            if (newlyArrived.length > 0) {
              for (const newAlert of newlyArrived) {
                this.knownAlertIds.add(newAlert.id);
                this.ingestLiveAlert({
                  id: newAlert.id,
                  timestamp: newAlert.timestamp,
                  threat_category: newAlert.threat_category || 'NETWORK',
                  attack_type: newAlert.alert_type || 'Observed Threat',
                  source_ip: newAlert.source_ip || '0.0.0.0',
                  destination_ip: newAlert.destination_ip || '0.0.0.0',
                  source_port: newAlert.source_port || 0,
                  destination_port: newAlert.destination_port || 80,
                  protocol: newAlert.protocol || 'TCP',
                  confidence: typeof newAlert.confidence === 'number' ? (newAlert.confidence > 1.0 ? newAlert.confidence / 100 : newAlert.confidence) : 0.9,
                  severity: newAlert.severity || 'HIGH',
                  risk_score: newAlert.risk_score || 75,
                  evidence: Array.isArray(newAlert.evidence) ? newAlert.evidence : [newAlert.description || 'Passive anomaly'],
                  description: newAlert.description
                });
              }
            }
          } else {
            // First load: record all existing Supabase alerts as historical audit entries
            alertItems.forEach((a: any) => this.knownAlertIds.add(a.id));
            this.state.events = alertItems.map((a: any) => ({
              id: a.id,
              timestamp: a.timestamp ? (a.timestamp.includes('T') ? new Date(a.timestamp).toLocaleTimeString() : a.timestamp) : 'Historical',
              sourceIp: a.source_ip || '0.0.0.0',
              destinationIp: a.destination_ip || '0.0.0.0',
              port: a.destination_port || 443,
              protocol: a.protocol || 'TCP',
              attackType: a.alert_type || a.threat_category || 'Historical Alert',
              severity: a.severity || 'HIGH',
              confidence: typeof a.confidence === 'number' ? (a.confidence > 1.0 ? a.confidence / 100 : a.confidence) : 0.9,
              description: a.description ? `[HISTORICAL] ${a.description}` : `[HISTORICAL] ${a.threat_category} recorded in Supabase`,
              category: 'HISTORICAL'
            }));

            // In Live Mode when idle: keep radar blips empty and show honest idle state
            this.state.radarBlips = [];
            this.state.attackArcs = [];
            this.state.notifications = [
              {
                id: 'live-idle',
                title: 'SYSTEM IDLE',
                message: 'No live threats detected — Sensor Active',
                severity: 'LOW',
                timestamp: 'Active',
                read: true,
                type: 'SENSOR_IDLE'
              }
            ];
            this.state.aiInsight = {
              text: 'No live threats detected — Sensor Active. Passively observing network traffic on monitored interface.',
              confidence: 100,
              status: 'IDLE',
              lastAnalysis: 'Passive observation active'
            };
          }
        } else {
          this.state.events = [];
          this.state.radarBlips = [];
          this.state.attackChainNodes = [];
          this.state.notifications = [
            {
              id: 'live-idle',
              title: 'SYSTEM IDLE',
              message: 'No live threats detected — Sensor Active',
              severity: 'LOW',
              timestamp: 'Active',
              read: true,
              type: 'SENSOR_IDLE'
            }
          ];
          this.state.aiInsight = {
            text: 'No live threats detected — Sensor Active. Passively observing network traffic on monitored interface.',
            confidence: 100,
            status: 'IDLE',
            lastAnalysis: 'Passive observation active'
          };
        }
      }

      // 3. Fetch real incidents from Supabase
      const incRes = await fetch(`${api}/incidents?limit=10`).catch(() => null);
      if (incRes && incRes.ok) {
        const incidents = await incRes.json();
        if (Array.isArray(incidents) && incidents.length > 0) {
          this.state.incidents = incidents.map((inc: any) => ({
            id: inc.id,
            code: inc.code || inc.id,
            title: inc.title || 'Security Incident',
            description: inc.description || 'Observed telemetry anomaly',
            severity: inc.severity || 'HIGH',
            status: inc.status || 'OPEN',
            sourceIp: inc.source_ip || '0.0.0.0',
            targetAsset: inc.target_asset || 'DMZ Gateway',
            assignedTo: inc.assigned_to || 'SecOps Lead',
            createdAt: inc.created_at || new Date().toISOString(),
            tactics: inc.tactics || 'Network Defense',
            recommendedAction: inc.recommended_action || 'Inspect firewall rules and isolate host',
            riskScore: inc.risk_score || 80,
            confidence: inc.confidence || 90
          }));
          this.state.activeIncident = this.state.incidents[0];
        } else {
          this.state.incidents = [];
          this.state.activeIncident = null;
        }
      }

      // 4. Fetch real assets from Supabase
      const assetRes = await fetch(`${api}/assets?limit=20`).catch(() => null);
      if (assetRes && assetRes.ok) {
        const assets = await assetRes.json();
        if (Array.isArray(assets) && assets.length > 0) {
          this.state.assets = assets.map((ast: any) => ({
            id: ast.id,
            hostname: ast.hostname || `HOST-${ast.ip_address}`,
            ipAddress: ast.ip_address || '0.0.0.0',
            assetType: ast.asset_type || 'Server',
            os: ast.os || 'Linux',
            status: ast.status || 'HEALTHY',
            riskScore: ast.risk_score || 20,
            cpu: ast.cpu_percent || 15,
            network: ast.network_speed || '1 Gbps',
            vulnerabilitiesCount: ast.vulnerabilities_count || 0,
            lastActivity: ast.last_activity ? new Date(ast.last_activity).toLocaleTimeString() : 'Active'
          }));
        }
      }
    } catch (err) {
      console.warn('[THREATWAVE LIVE] Could not fetch initial data from backend:', err);
    }
    this.notify();
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

  public toggleLiveLabMode(enabled?: boolean): boolean {
    this.state.liveLabMode = enabled !== undefined ? enabled : !this.state.liveLabMode;
    if (this.state.liveLabMode) {
      this.state.demoMode = false;
      this.stopAutoTicker();
      this.state.radarBlips = [];
      this.state.attackArcs = [];
      this.state.attackChainNodes = [];
      this.state.notifications = [
        {
          id: 'live-idle',
          title: 'SYSTEM IDLE',
          message: 'No live threats detected — Sensor Active',
          severity: 'LOW',
          timestamp: 'Active',
          read: true,
          type: 'SENSOR_IDLE'
        }
      ];
      this.fetchInitialLiveData();
      realtimeClient.connect();
    } else {
      realtimeClient.disconnect();
      this.state = this.getMockDemoState();
      this.startAutoTicker();
    }
    this.notify();
    return this.state.liveLabMode;
  }

  public toggleDemoMode(enabled?: boolean): boolean {
    this.state.demoMode = enabled !== undefined ? enabled : !this.state.demoMode;
    if (this.state.demoMode) {
      this.state.liveLabMode = false;
      realtimeClient.disconnect();
      this.state = this.getMockDemoState();
      this.startAutoTicker();
    } else {
      this.stopAutoTicker();
      this.state = this.getCleanLiveState();
      realtimeClient.connect();
      this.fetchInitialLiveData();
    }
    this.notify();
    return this.state.demoMode;
  }

  public ingestLiveAlert(alert: RealtimeAlert): void {
    const timeStr = new Date(alert.timestamp || Date.now()).toTimeString().substring(0, 8);

    const newEv: SecurityEvent = {
      id: alert.id || `live-ev-${Date.now()}`,
      timestamp: timeStr,
      sourceIp: alert.source_ip,
      destinationIp: alert.destination_ip,
      port: alert.destination_port || 80,
      protocol: (alert.protocol || 'TCP') as any,
      attackType: alert.attack_type,
      severity: alert.severity,
      confidence: alert.confidence > 1.0 ? alert.confidence / 100 : alert.confidence,
      description: alert.description || (alert.evidence && alert.evidence[0]) || `${alert.threat_category} detected`,
      category: (alert.threat_category || 'NETWORK') as any
    };

    // Prepend live event
    this.state.events = [newEv, ...this.state.events.slice(0, 49)];

    // Update global metrics
    this.state.metrics.totalThreats += 1;
    this.state.metrics.aiDetections += 1;
    if (alert.severity === 'CRITICAL') {
      this.state.metrics.criticalThreats += 1;
      this.state.metrics.securityScore = Math.max(15, this.state.metrics.securityScore - 5);
    } else {
      this.state.metrics.securityScore = Math.max(20, this.state.metrics.securityScore - 2);
    }

    // Update Threat Graph node
    const newNode: AttackChainNode = {
      id: `node-${Date.now()}`,
      name: alert.attack_type.toUpperCase(),
      stage: alert.threat_category,
      status: 'ACTIVE',
      eventCount: 1,
      details: alert.evidence.length > 0 ? alert.evidence.join(' | ') : `${alert.source_ip} -> ${alert.destination_ip}`
    };
    this.state.attackChainNodes = [newNode, ...this.state.attackChainNodes.slice(0, 8)];

    // Update Radar blip
    const blipAngle = Math.floor(Math.random() * 360);
    this.state.radarBlips = [
      {
        id: `blip-${Date.now()}`,
        name: alert.attack_type,
        angle: blipAngle,
        radius: 0.35 + Math.random() * 0.45,
        severity: alert.severity,
        ip: alert.source_ip,
        pulsing: true
      },
      ...this.state.radarBlips.slice(0, 7)
    ];

    // Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `LIVE DETECTION: ${alert.attack_type}`,
      message: `${alert.threat_category} detected from ${alert.source_ip} targeting ${alert.destination_ip}. Confidence: ${alert.confidence}%.`,
      severity: alert.severity,
      timestamp: 'Just now',
      read: false,
      type: alert.severity === 'CRITICAL' ? 'CRITICAL_THREAT' : 'AI_ANOMALY'
    };
    this.state.notifications = [notif, ...this.state.notifications.slice(0, 19)];

    // CyberGuard AI Context
    this.state.aiInsight = {
      text: `[CYBERGUARD OBSERVATION] Real detection: ${alert.attack_type} (${alert.threat_category}) originating from ${alert.source_ip} targeting ${alert.destination_ip}. Evidence: ${alert.evidence.join('. ')}. Recommended defense: Isolate host and verify firewall filtering rules.`,
      confidence: alert.confidence,
      status: 'ACTIVE',
      lastAnalysis: 'Just now'
    };

    // Escalate to Incident
    if (alert.severity === 'CRITICAL') {
      const incCode = `INC-${Date.now().toString().slice(-4)}`;
      const newInc: Incident = {
        id: `inc-${Date.now()}`,
        code: incCode,
        title: `Live Incident: ${alert.attack_type}`,
        description: `Correlated attack sequence detected against ${alert.destination_ip}. ${alert.evidence.join('. ')}`,
        severity: 'CRITICAL',
        status: 'OPEN',
        sourceIp: alert.source_ip,
        targetAsset: alert.destination_ip,
        assignedTo: 'SecOps AI Copilot',
        createdAt: new Date().toISOString(),
        tactics: alert.threat_category,
        recommendedAction: `ISOLATE_HOST ${alert.destination_ip} AND BLOCK_IP ${alert.source_ip}`,
        riskScore: alert.risk_score,
        confidence: alert.confidence
      };
      this.state.incidents = [newInc, ...this.state.incidents.slice(0, 9)];
      this.state.activeIncident = newInc;
      this.state.metrics.activeIncidents += 1;
    }

    this.notify();
  }

  private startAutoTicker(): void {
    if (!this.state.demoMode || this.state.liveLabMode) {
      this.stopAutoTicker();
      return;
    }
    if (this.tickerInterval) clearInterval(this.tickerInterval);
    this.tickerInterval = window.setInterval(() => {
      if (!this.state.demoMode || this.state.liveLabMode || this.state.activeSimulation.isSimulating) {
        this.stopAutoTicker();
        return;
      }
      this.generateSyntheticTickEvent();
    }, 4000);
  }

  private stopAutoTicker(): void {
    if (this.tickerInterval) {
      clearInterval(this.tickerInterval);
      this.tickerInterval = null;
    }
  }

  private sequenceIndex = 0;

  // Generate continuous background synthetic threat event matching requested safe sequence (DEMO MODE ONLY)
  private generateSyntheticTickEvent(): void {
    if (!this.state.demoMode || this.state.liveLabMode) {
      this.stopAutoTicker();
      return;
    }
    const sequence = [
      { attackType: 'Normal Traffic Baseline', src: '192.168.1.100', dst: '10.0.1.20', port: 443, proto: 'TCP', sev: 'LOW', conf: 0.99, desc: 'Nominal HTTP/2 TLS session activity within baseline parameters', cat: 'NETWORK' },
      { attackType: 'Port Scan', src: '192.168.10.50', dst: '10.0.0.15', port: 445, proto: 'TCP', sev: 'HIGH', conf: 0.94, desc: 'Stealth SYN sweep across destination ports 21-8080 (1,024 probes)', cat: 'NETWORK' },
      { attackType: 'SQL Injection', src: '10.0.0.15', dst: '10.0.1.50', port: 80, proto: 'TCP', sev: 'CRITICAL', conf: 0.97, desc: "Tainted parameter `' OR 1=1--` intercepted in HTTP search query", cat: 'WEB' },
      { attackType: 'Suspicious Login', src: '10.0.1.20', dst: '10.0.1.15', port: 389, proto: 'TCP', sev: 'HIGH', conf: 0.89, desc: 'Admin session forged without MFA from anomalous user-agent', cat: 'AUTHENTICATION' },
      { attackType: 'Privilege Escalation', src: '10.0.1.20', dst: '10.0.1.50', port: 5432, proto: 'TCP', sev: 'CRITICAL', conf: 0.95, desc: 'Unauthorized role elevation command `ALTER ROLE postgres WITH SUPERUSER`', cat: 'AUTHENTICATION' },
      { attackType: 'Database Access', src: '10.0.1.20', dst: '10.0.1.50', port: 5432, proto: 'TCP', sev: 'CRITICAL', conf: 0.98, desc: 'Sequential dump of 14,000 sensitive records from public.users', cat: 'WEB' },
      { attackType: 'Data Transfer Anomaly', src: '10.0.1.50', dst: '194.26.29.112', port: 443, proto: 'TCP', sev: 'CRITICAL', conf: 0.96, desc: 'Anomalous bulk TLS egress stream (+1,400% above 30-day baseline)', cat: 'NETWORK' },
      { attackType: 'Incident Created (THR-1042)', src: '185.220.101.5', dst: '10.0.1.50', port: 443, proto: 'TCP', sev: 'CRITICAL', conf: 0.98, desc: 'Autonomous ThreatWave correlation synthesizes 7-stage kill chain ticket', cat: 'MALWARE' }
    ];

    const pick = sequence[this.sequenceIndex % sequence.length];
    this.sequenceIndex++;

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
  // UNIFIED 6 CORE THREATS & FULL ATTACK STORY SIMULATION PIPELINE (DEMO ONLY)
  // ========================================================================
  public async simulateAttack(threatType: string): Promise<void> {
    if (this.state.liveLabMode || !this.state.demoMode) {
      console.log('[THREATWAVE LIVE] In Live Mode: client-side synthetic threat simulation is blocked. Real alerts must arrive via real sensor telemetry.');
      return;
    }
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
