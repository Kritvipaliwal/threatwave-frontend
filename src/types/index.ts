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

export type IntelligenceTag = 'OBSERVED' | 'INFERRED' | 'PREDICTED' | 'RECOMMENDED';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  sourceIp: string;
  destinationIp: string;
  port?: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'SMTP' | 'POSTGRES' | 'DNS' | 'TLS' | string;
  attackType: string;
  severity: Severity;
  confidence: number; // 0 to 1
  description: string;
  category: 'NETWORK' | 'WEB' | 'AUTHENTICATION' | 'MALWARE' | 'PHISHING' | 'DISCOVERY' | 'LATERAL_MOVEMENT' | 'EXFILTRATION' | 'COMMAND_AND_CONTROL' | string;
  riskScore?: number;
  sensor?: string;
  detectionMethod?: string;
  incidentId?: string;
}

export interface Incident {
  id: string;
  code?: string;
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
  riskScore?: number;
  confidence?: number;
  eventsCount?: number;
}

export interface Asset {
  id: string;
  hostname: string;
  ipAddress: string;
  assetType: 'Server' | 'Workstation' | 'Firewall' | 'Database' | 'Gateway' | string;
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
  type: 'CRITICAL_THREAT' | 'AI_ANOMALY' | 'RESPONSE_SUCCESS' | 'SENSOR_IDLE';
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

// ----------------------------------------------------
// Enhanced SOC Models Matching ThreatWave Backend APIs
// ----------------------------------------------------

export interface DetectionBreakdown {
  ruleConfidence: number;      // 0 - 100
  statisticalScore: number;    // 0 - 100
  baselineScore: number;       // 0 - 100
  mlConfidence: number;        // 0 - 100
  threatIntelScore: number;    // 0 - 100
  fusedConfidence: number;     // 0 - 100
  ruleName?: string;
  zScore?: number;
  baselineDeviation?: string;
  intelFeed?: string;
}

export interface NetworkNode {
  id: string;
  type: 'local_host' | 'device' | 'external_target' | 'gateway' | string;
  label: string;
  status: 'online' | 'offline' | 'suspicious' | 'compromised';
  ip: string;
  mac?: string;
}

export interface NetworkEdge {
  source: string;
  target: string;
  protocol: string;
  port: number;
  status: string;
  threat: boolean;
}

export interface NetworkMapResponse {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  last_seen: string;
  status: string;
}

export interface AnomalyMetricItem {
  id: string;
  title: string;
  metricType: 'DNS' | 'CONNECTION_BURST' | 'DESTINATION' | 'PORT' | 'EGRESS_VOLUME' | 'BEHAVIORAL' | 'BASELINE';
  expected: string;
  observed: string;
  deviation: string; // e.g. "+311%"
  detectionMethod: 'STATISTICAL' | 'BASELINE' | 'HEURISTIC' | 'SIGNAL_FUSION';
  confidence: number;
  risk: Severity;
  timestamp: string;
  targetAsset: string;
  sourceIp: string;
  details: string;
  timeSeriesData?: { time: string; expected: number; observed: number }[];
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
  graphNodeId?: string;
  tag?: IntelligenceTag;
}

export interface AttackStoryResponse {
  id: string;
  code: string;
  title: string;
  adversary: string;
  targetAsset: string;
  status: string;
  startTime: string;
  riskScore: number;
  confidence: number;
  correlatedEventsCount: number;
  steps: AttackStoryStep[];
  aiAnalysis: string;
}

export interface AttackGraphNodeSchema {
  id: string;
  name: string;
  stage: string;
  type: 'attacker' | 'recon' | 'portscan' | 'webserver' | 'sqli' | 'compromise' | 'privesc' | 'database' | 'exfil' | string;
  severity: Severity;
  status: string;
  x: number;
  y: number;
  ip?: string;
  details: string;
  eventCount: number;
}

export interface AttackGraphEdgeSchema {
  from_node: string;
  to_node: string;
  status: string;
  technique?: string;
}

export interface AttackGraphResponse {
  nodes: AttackGraphNodeSchema[];
  edges: AttackGraphEdgeSchema[];
}

export interface AIInvestigateResponse {
  incident_id?: string;
  analysis: string;
  root_cause: string;
  blast_radius: string;
  attack_vector: string;
  recommended_containment: string[];
  mitre_tactics: string[];
  mitre_techniques: string[];
  confidence: number;
  generated_at: string;
  model_used: string;
}

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIChatResponse {
  reply: string;
  suggestions: string[];
  context_refs?: string[];
  timestamp: string;
}

export interface EvidenceItem {
  id: string;
  sensor: string;
  timestamp: string;
  title: string;
  details: string;
  hash_sha256?: string;
  payloadSnippet?: string;
  pcapAvailable?: boolean;
}

export interface SystemHealthStatus {
  frontend: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  backend: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  database: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  zeekSensor: 'ONLINE' | 'SIMULATED' | 'OFFLINE';
  tshark: 'ONLINE' | 'OFFLINE';
  websocket: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  aiProvider: 'ONLINE' | 'STANDBY' | 'OFFLINE';
  lastEventTime?: string;
  lastApiCall?: string;
  eventsProcessed?: number;
  eventsPerSec?: number;
}

export interface SystemVersionInfo {
  application: string;
  frontend_version: string;
  backend_version: string;
  schema_version: string;
  api_version: string;
  environment: string;
  feature_flags: {
    attack_story: boolean;
    attack_graph: boolean;
    anomaly_center: boolean;
    ai_investigator: boolean;
    live_network_map: boolean;
  };
}

export type ActivePage = 
  | 'overview'
  | 'network-map'
  | 'live-detection'
  | 'anomaly-center'
  | 'threat-hunting'
  | 'threat-intelligence'
  | 'threat-graph'
  | 'attack-timeline'
  | 'evidence-explorer'
  | 'ai-assistant'
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
  | 'system-flow'
  | 'system-health'
  | 'settings';
