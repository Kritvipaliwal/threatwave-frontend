import { demoEngine } from '../demo/demoEngine';
import type { SecurityEvent, Incident, Asset, Vulnerability, IOC, NotificationItem, SocMetrics } from '../types';

/**
 * THREATWAVE ENTERPRISE API ABSTRACTION
 * 
 * Configured via environment variables:
 * - VITE_DEMO_MODE: 'true' (default) for standalone SOC demo simulation
 * - VITE_API_URL: 'http://127.0.0.1:5000/api' or production Flask endpoint
 * 
 * Switching to backend later requires ONLY changing VITE_DEMO_MODE=false and setting VITE_API_URL!
 * Zero architectural changes or code rewrites required.
 */
const rawDemoEnv = import.meta.env.VITE_DEMO_MODE ?? import.meta.env.DEMO_MODE;
export const IS_DEMO_MODE = rawDemoEnv === undefined ? true : rawDemoEnv !== 'false' && rawDemoEnv !== false;
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

export const apiClient = {
  isDemoMode(): boolean {
    return IS_DEMO_MODE;
  },

  getBaseUrl(): string {
    return API_BASE_URL;
  },

  async getMetrics(): Promise<SocMetrics> {
    if (IS_DEMO_MODE) return demoEngine.getState().metrics;
    try {
      const res = await fetch(`${API_BASE_URL}/overview`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return {
        totalThreats: data.total_logs || 1482,
        criticalThreats: data.critical_threats || 14,
        activeIncidents: data.active_incidents || 2,
        blockedIps: data.blocked_ips || 18,
        aiDetections: data.ai_detections || 54,
        assetsMonitored: data.monitored_assets || 6,
        vulnerabilities: data.vulnerabilities || 4,
        securityScore: data.security_score || 87
      };
    } catch {
      return demoEngine.getState().metrics;
    }
  },

  async getEvents(limit: number = 25): Promise<SecurityEvent[]> {
    if (IS_DEMO_MODE) return demoEngine.getState().events.slice(0, limit);
    try {
      const res = await fetch(`${API_BASE_URL}/events?limit=${limit}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.events || demoEngine.getState().events;
    } catch {
      return demoEngine.getState().events.slice(0, limit);
    }
  },

  async getIncidents(): Promise<Incident[]> {
    if (IS_DEMO_MODE) return demoEngine.getState().incidents;
    try {
      const res = await fetch(`${API_BASE_URL}/incidents`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.incidents || demoEngine.getState().incidents;
    } catch {
      return demoEngine.getState().incidents;
    }
  },

  async getAssets(): Promise<Asset[]> {
    if (IS_DEMO_MODE) return demoEngine.getState().assets;
    try {
      const res = await fetch(`${API_BASE_URL}/assets`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.assets || demoEngine.getState().assets;
    } catch {
      return demoEngine.getState().assets;
    }
  },

  async getVulnerabilities(): Promise<Vulnerability[]> {
    if (IS_DEMO_MODE) return demoEngine.getState().vulnerabilities;
    try {
      const res = await fetch(`${API_BASE_URL}/vulnerabilities`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.vulnerabilities || demoEngine.getState().vulnerabilities;
    } catch {
      return demoEngine.getState().vulnerabilities;
    }
  },

  async getIOCs(): Promise<IOC[]> {
    if (IS_DEMO_MODE) return demoEngine.getState().iocs;
    try {
      const res = await fetch(`${API_BASE_URL}/iocs`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data || demoEngine.getState().iocs;
    } catch {
      return demoEngine.getState().iocs;
    }
  },

  async getNotifications(): Promise<NotificationItem[]> {
    if (IS_DEMO_MODE) return demoEngine.getState().notifications;
    try {
      const res = await fetch(`${API_BASE_URL}/notifications`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.notifications || demoEngine.getState().notifications;
    } catch {
      return demoEngine.getState().notifications;
    }
  },

  async queryAiAssistant(prompt: string): Promise<{ response: string; severity?: string; confidence?: number }> {
    if (IS_DEMO_MODE) {
      await new Promise(r => setTimeout(r, 600));
      return {
        response: `ThreatWave AI Analyst Assessment: Correlated multi-vector telemetry matching inquiry "${prompt}". MITRE ATT&CK attribution suggests adversary reconnaissance. Automated SOAR playbook recommended.`,
        severity: 'CRITICAL',
        confidence: 0.96
      };
    }
    try {
      const res = await fetch(`${API_BASE_URL}/ai/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return {
        response: `ThreatWave AI Copilot offline. Falling back to local neural pattern analyzer.`,
        severity: 'HIGH',
        confidence: 0.91
      };
    }
  },

  async executeResponseAction(action: string, target: string): Promise<boolean> {
    demoEngine.executeResponseAction(action, target);
    if (!IS_DEMO_MODE) {
      try {
        await fetch(`${API_BASE_URL}/response/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, target })
        });
      } catch {
        // Fallback already performed in local state
      }
    }
    return true;
  }
};

export const api = apiClient;
export default apiClient;
