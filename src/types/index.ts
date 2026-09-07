export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type AttackType = 
  | 'DDOS'
  | 'BOTNET_C2'
  | 'DGA_DNS_TUNNEL'
  | 'MALICIOUS_ENCRYPTED_SESSION'
  | 'RECON_PORT_SCAN'
  | 'DATA_EXFILTRATION'
  | 'FULL_ATTACK_STORY'
  | 'PORT_SCAN'
  | 'BRUTE_FORCE'
  | 'SQL_INJECTION'
  | 'PHISHING'
  | 'MALWARE';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  sourceIp: string;
  destinationIp: string;
  port: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'SMTP';
  attackType: string;
  severity: Severity;
  confidence: number; // 0 to 1
  description: string;
  category: 'NETWORK' | 'WEB' | 'AUTHENTICATION' | 'MALWARE' | 'PHISHING';
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED' | 'OPEN';
  sourceIp: string;
  targetAsset: string;
  assignedTo: string;
  createdAt: string;
  tactics: string;
  recommendedAction: string;
}

export interface Asset {
  id: string;
  hostname: string;
  ipAddress: string;
  assetType: 'Server' | 'Workstation' | 'Firewall' | 'Database' | 'Gateway';
  os: string;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  riskScore: number;
  cpu: number;
  network: string;
  vulnerabilitiesCount: number;
  lastActivity: string;
}

export interface Vulnerability {
  id: string;
  cveId: string;
  title: string;
  severity: Severity;
  cvssScore: number;
  affectedAsset: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'MITIGATED';
  description: string;
  remediation: string;
}

export interface IOC {
  id: string;
  value: string;
  type: 'IP' | 'DOMAIN' | 'URL' | 'HASH' | 'CVE';
  threatScore: number;
  reputation: 'MALICIOUS' | 'SUSPICIOUS' | 'CLEAN';
  country: string;
  organization: string;
  firstSeen: string;
  associatedThreats: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  severity: Severity;
  timestamp: string;
  read: boolean;
  type: 'CRITICAL_THREAT' | 'AI_ANOMALY' | 'RESPONSE_SUCCESS';
}

export interface RadarBlip {
  id: string;
  name: string;
  angle: number; // in degrees
  radius: number; // 0 to 1
  severity: Severity;
  ip: string;
  pulsing: boolean;
}

export interface AttackArc {
  id: string;
  sourceCity: string;
  sourceCountry: string;
  sourceCoords: [number, number]; // [lat, lon]
  targetCity: string;
  targetCountry: string;
  targetCoords: [number, number]; // [lat, lon]
  attackType: string;
  severity: Severity;
  progress: number;
}

export interface AttackChainNode {
  id: string;
  name: string;
  stage: string;
  status: 'IDLE' | 'ACTIVE' | 'CONTAINED';
  eventCount: number;
  details: string;
}

export interface SocMetrics {
  totalThreats: number;
  criticalThreats: number;
  activeIncidents: number;
  blockedIps: number;
  aiDetections: number;
  assetsMonitored: number;
  vulnerabilities: number;
  securityScore: number;
}

export type ActivePage = 
  | 'overview'
  | 'ai-assistant'
  | 'live-detection'
  | 'threat-hunting'
  | 'threat-intelligence'
  | 'threat-graph'
  | 'attack-timeline'
  | 'vulnerabilities'
  | 'malware'
  | 'phishing'
  | 'ioc-investigation'
  | 'assets'
  | 'security-posture'
  | 'incident-response'
  | 'attack-simulator'
  | 'analytics'
  | 'reports'
  | 'notifications'
  | 'settings';
