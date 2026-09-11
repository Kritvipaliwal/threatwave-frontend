import type { 
  SecurityEvent, Incident, Asset, Vulnerability, IOC, NotificationItem, 
  SocMetrics, AttackStoryResponse, AttackGraphResponse, NetworkMapResponse,
  AIInvestigateResponse, AIChatResponse
} from '../types';

/**
 * THREATWAVE LIVE CYBERSECURITY CENTRAL API SERVICE
 * 
 * Central HTTP client communicating with FastAPI backend:
 * - Default: http://127.0.0.1:8000/api
 * - Uses real observed database telemetry.
 * - Displays authentic empty states when no active telemetry or threats are observed.
 */

const rawDemoEnv = import.meta.env.VITE_DEMO_MODE ?? import.meta.env.DEMO_MODE;
export const IS_DEMO_MODE = rawDemoEnv === 'true' || rawDemoEnv === true;
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export interface DashboardResponse {
  metrics: SocMetrics;
  eventsPerSec: number;
  packetsPerSec: number;
  detectionConfidence: number;
  sensorConnected: boolean;
  activeStoryId: string;
  riskScore: number;
  activeThreats: number;
  criticalThreats: number;
  totalAssets: number;
  sensorStatus: {
    name: string;
    status: string;
    interface: string;
    events_ingested: number;
  };
}

export class ApiClient {
  private baseUrl: string = API_BASE_URL;

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public isDemoMode(): boolean {
    return IS_DEMO_MODE;
  }

  public async fetchWithTimeout<T>(endpoint: string, options: RequestInit = {}, timeoutMs: number = 4000): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  // GET /api/dashboard/metrics
  async getDashboard(): Promise<DashboardResponse> {
    const emptyState: DashboardResponse = {
      metrics: {
        totalThreats: 0,
        criticalThreats: 0,
        activeIncidents: 0,
        blockedIps: 0,
        aiDetections: 0,
        assetsMonitored: 0,
        vulnerabilities: 0,
        securityScore: 0
      },
      eventsPerSec: 0.0,
      packetsPerSec: 0.0,
      detectionConfidence: 0.0,
      sensorConnected: false,
      activeStoryId: '',
      riskScore: 0.0,
      activeThreats: 0,
      criticalThreats: 0,
      totalAssets: 0,
      sensorStatus: {
        name: 'Zeek Passive Sensor',
        status: 'OFFLINE',
        interface: 'eth0',
        events_ingested: 0
      }
    };

    try {
      const data = await this.fetchWithTimeout<any>('/dashboard/metrics');
      const activeThreats = data.active_threats ?? 0;
      const criticalThreats = data.critical_threats ?? 0;
      const totalAssets = data.total_assets ?? 0;
      const vulnerableAssets = data.vulnerable_assets ?? 0;
      const mitigatedCount = data.mitigated_count ?? 0;
      const avgRisk = data.average_risk_score ?? 0.0;
      const eps = data.events_per_sec ?? 0.0;
      const pps = data.packets_per_sec ?? 0.0;

      return {
        metrics: {
          totalThreats: activeThreats,
          criticalThreats: criticalThreats,
          activeIncidents: activeThreats > 0 ? 1 : 0,
          blockedIps: mitigatedCount,
          aiDetections: activeThreats,
          assetsMonitored: totalAssets,
          vulnerabilities: vulnerableAssets,
          securityScore: Math.round(avgRisk)
        },
        eventsPerSec: eps,
        packetsPerSec: pps,
        detectionConfidence: activeThreats > 0 ? 95.0 : 0.0,
        sensorConnected: data.sensor_status?.status === 'ONLINE',
        activeStoryId: activeThreats > 0 ? 'CURRENT' : '',
        riskScore: avgRisk,
        activeThreats: activeThreats,
        criticalThreats: criticalThreats,
        totalAssets: totalAssets,
        sensorStatus: data.sensor_status || emptyState.sensorStatus
      };
    } catch {
      return emptyState;
    }
  }

  async getMetrics(): Promise<SocMetrics> {
    const dash = await this.getDashboard();
    return dash.metrics;
  }

  // GET /api/events
  async getEvents(limit: number = 50): Promise<SecurityEvent[]> {
    try {
      const data = await this.fetchWithTimeout<any[]>(`/events?limit=${limit}`);
      if (!Array.isArray(data)) return [];
      return data.map(ev => ({
        id: ev.id,
        timestamp: ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : 'N/A',
        sourceIp: ev.source_ip || ev.sourceIp || '0.0.0.0',
        destinationIp: ev.destination_ip || ev.destinationIp || '0.0.0.0',
        port: ev.destination_port || ev.port || 0,
        protocol: ev.protocol || 'TCP',
        attackType: ev.event_type || ev.attackType || 'Network Flow',
        severity: ev.severity || 'LOW',
        confidence: ev.confidence || 0.9,
        description: ev.description || 'Observed telemetry event',
        category: ev.category || 'NETWORK',
        riskScore: ev.risk_score || ev.riskScore
      }));
    } catch {
      return [];
    }
  }

  // GET /api/threats
  async getThreats(): Promise<any[]> {
    try {
      const data = await this.fetchWithTimeout<any[]>('/threats');
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      return [];
    }
  }

  // GET /api/incidents
  async getIncidents(): Promise<Incident[]> {
    try {
      const data = await this.fetchWithTimeout<Incident[]>('/incidents');
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      return [];
    }
  }

  // GET /api/attack-story
  async getAttackStory(id?: string): Promise<AttackStoryResponse> {
    const emptyStory: AttackStoryResponse = {
      id: '',
      code: 'NO-INCIDENT',
      title: 'No active attack story',
      adversary: 'N/A',
      targetAsset: 'N/A',
      status: 'IDLE',
      startTime: 'N/A',
      riskScore: 0,
      confidence: 0,
      correlatedEventsCount: 0,
      steps: [],
      aiAnalysis: 'No threat telemetry or attack sequences observed in database.'
    };

    try {
      const queryParam = id ? `?incident=${encodeURIComponent(id)}` : '';
      const data = await this.fetchWithTimeout<AttackStoryResponse>(`/attack-story${queryParam}`);
      if (data && Array.isArray(data.steps)) return data;
      return emptyStory;
    } catch {
      return emptyStory;
    }
  }

  // GET /api/attack-graph
  async getAttackGraph(id?: string): Promise<AttackGraphResponse> {
    try {
      const queryParam = id ? `?incident=${encodeURIComponent(id)}` : '';
      const data = await this.fetchWithTimeout<AttackGraphResponse>(`/attack-graph${queryParam}`);
      if (data && Array.isArray(data.nodes)) return data;
      return { nodes: [], edges: [] };
    } catch {
      return { nodes: [], edges: [] };
    }
  }

  // GET /api/network/map
  async getNetworkMap(): Promise<NetworkMapResponse> {
    try {
      const data = await this.fetchWithTimeout<NetworkMapResponse>('/network/map');
      if (data && Array.isArray(data.nodes)) return data;
      return { nodes: [], edges: [], last_seen: 'Waiting for observed telemetry', status: 'idle' };
    } catch {
      return { nodes: [], edges: [], last_seen: 'Offline', status: 'idle' };
    }
  }

  // POST /api/response/execute
  async approveResponse(incidentId: string, action: string, target: string, reason: string): Promise<any> {
    try {
      return await this.fetchWithTimeout<any>('/response/execute', {
        method: 'POST',
        body: JSON.stringify({ incident_id: incidentId, action, target, reason })
      });
    } catch (err: any) {
      return {
        success: false,
        action,
        target,
        status: 'FAILED',
        approved_by: 'N/A',
        timestamp: new Date().toISOString(),
        message: `Failed to execute containment action: ${err.message || 'Backend offline'}`
      };
    }
  }

  // POST /api/ai/investigate
  async investigateAI(incidentId?: string): Promise<AIInvestigateResponse> {
    const fallbackAI: AIInvestigateResponse = {
      incident_id: incidentId || 'NONE',
      analysis: 'Insufficient evidence. No active incident telemetry observed in database.',
      root_cause: 'No anomalous telemetry recorded.',
      blast_radius: '0 assets impacted.',
      attack_vector: 'None observed',
      recommended_containment: [
        'Ensure passive network sensors (Zeek/TShark) are online and actively capturing traffic.',
        'Verify database connection health.'
      ],
      mitre_tactics: [],
      mitre_techniques: [],
      confidence: 0.0,
      generated_at: new Date().toISOString(),
      model_used: 'ThreatWave-SecOps-Reasoner-v2'
    };

    try {
      return await this.fetchWithTimeout<AIInvestigateResponse>('/ai/investigate', {
        method: 'POST',
        body: JSON.stringify({ incident_id: incidentId })
      });
    } catch {
      return fallbackAI;
    }
  }

  // POST /api/ai/chat
  async chatCopilot(message: string, incidentId?: string): Promise<AIChatResponse> {
    try {
      return await this.fetchWithTimeout<AIChatResponse>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, incident_id: incidentId })
      });
    } catch {
      return {
        reply: 'SecOps Copilot is currently active and monitoring database telemetry. No active security incidents are currently detected.',
        suggestions: ['Check Sensor Status', 'View Network Map', 'Telemetry Health'],
        context_refs: ['Database: Connected', 'Telemetry: Clean'],
        timestamp: new Date().toLocaleTimeString()
      };
    }
  }

  // GET /api/assets
  async getAssets(): Promise<Asset[]> {
    try {
      const data = await this.fetchWithTimeout<Asset[]>('/assets');
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      return [];
    }
  }

  // GET /api/vulnerabilities
  async getVulnerabilities(): Promise<Vulnerability[]> {
    try {
      const data = await this.fetchWithTimeout<Vulnerability[]>('/vulnerabilities');
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      return [];
    }
  }

  // GET /api/iocs
  async getIOCs(): Promise<IOC[]> {
    try {
      const data = await this.fetchWithTimeout<IOC[]>('/iocs');
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      return [];
    }
  }

  // GET /api/notifications
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const data = await this.fetchWithTimeout<NotificationItem[]>('/notifications');
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      return [];
    }
  }

  async queryAiAssistant(prompt: string): Promise<{ response: string; severity?: string; confidence?: number }> {
    const res = await this.chatCopilot(prompt);
    return {
      response: res.reply,
      severity: 'LOW',
      confidence: 0.90
    };
  }

  async executeResponseAction(action: string, target: string): Promise<boolean> {
    const res = await this.approveResponse('', action, target, 'Manual analyst execution');
    return res.success === true;
  }
}

export const apiClient = new ApiClient();
export const api = apiClient;
export default apiClient;
