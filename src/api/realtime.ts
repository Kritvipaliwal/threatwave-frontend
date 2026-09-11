/**
 * THREATWAVE REAL-TIME BACKEND STREAM CLIENT
 * 
 * Supports both WebSocket (/ws, /api/ws) and SSE fallback (/api/sensor/stream).
 * Feeds live alerts and telemetry events directly into the centralized SOC state.
 */

export interface RealtimeAlert {
  id: string;
  timestamp: string;
  threat_category: string;
  attack_type: string;
  source_ip: string;
  destination_ip: string;
  source_port?: number;
  destination_port?: number;
  protocol?: string;
  confidence: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  risk_score: number;
  evidence: string[];
  description?: string;
}

export type ConnectionStatus = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';

type AlertHandler = (alert: RealtimeAlert) => void;
type StatusHandler = (status: ConnectionStatus) => void;

class RealtimeStreamClient {
  private ws: WebSocket | null = null;
  private sse: EventSource | null = null;
  private status: ConnectionStatus = 'DISCONNECTED';
  private alertListeners: Set<AlertHandler> = new Set();
  private statusListeners: Set<StatusHandler> = new Set();
  private reconnectTimer: number | null = null;
  private isLiveMode: boolean = false;

  public getApiBaseUrl(): string {
    return localStorage.getItem('threatwave_api_url') || import.meta.env.VITE_API_URL || 'https://threatwave-backend-1.onrender.com/api';
  }

  public getWsUrl(): string {
    const custom = localStorage.getItem('threatwave_ws_url');
    if (custom) return custom;
    
    const api = this.getApiBaseUrl();
    if (api.startsWith('https://')) {
      return api.replace('https://', 'wss://').replace('/api', '') + '/ws';
    }
    if (api.startsWith('http://')) {
      return api.replace('http://', 'ws://').replace('/api', '') + '/ws';
    }
    return import.meta.env.VITE_WS_URL || 'wss://threatwave-backend-1.onrender.com/ws';
  }

  public setBackendUrls(apiUrl: string, wsUrl?: string) {
    if (apiUrl) localStorage.setItem('threatwave_api_url', apiUrl);
    if (wsUrl) localStorage.setItem('threatwave_ws_url', wsUrl);
    if (this.isLiveMode) {
      this.disconnect();
      this.connect();
    }
  }

  public onAlert(handler: AlertHandler): () => void {
    this.alertListeners.add(handler);
    return () => this.alertListeners.delete(handler);
  }

  public onStatus(handler: StatusHandler): () => void {
    this.statusListeners.add(handler);
    handler(this.status);
    return () => this.statusListeners.delete(handler);
  }

  private setStatus(newStatus: ConnectionStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.statusListeners.forEach(h => h(this.status));
    }
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  public connect() {
    this.isLiveMode = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    const wsUrl = this.getWsUrl();
    this.setStatus('CONNECTING');

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.setStatus('CONNECTED');
        console.log('[THREATWAVE REALTIME] Connected to WebSocket bus:', wsUrl);
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          this.handleIncomingPayload(payload);
        } catch (err) {
          console.debug('[THREATWAVE REALTIME] Message parse error:', err);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('[THREATWAVE REALTIME] WebSocket error, attempting SSE fallback...', err);
        this.connectSSE();
      };

      this.ws.onclose = () => {
        if (this.isLiveMode && !this.sse) {
          this.setStatus('DISCONNECTED');
          this.scheduleReconnect();
        }
      };
    } catch (err) {
      console.warn('[THREATWAVE REALTIME] Could not open WebSocket, falling back to SSE:', err);
      this.connectSSE();
    }
  }

  private connectSSE() {
    if (this.sse) {
      this.sse.close();
      this.sse = null;
    }

    const apiUrl = this.getApiBaseUrl();
    const sseUrl = `${apiUrl}/sensor/stream`;

    try {
      this.sse = new EventSource(sseUrl);

      this.sse.onopen = () => {
        this.setStatus('CONNECTED');
        console.log('[THREATWAVE REALTIME] Connected to SSE Stream:', sseUrl);
      };

      this.sse.addEventListener('alert', (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data);
          this.handleIncomingPayload(payload);
        } catch (err) {
          console.debug('[THREATWAVE REALTIME] SSE alert parse error:', err);
        }
      });

      this.sse.onerror = () => {
        this.setStatus('DISCONNECTED');
        if (this.sse) {
          this.sse.close();
          this.sse = null;
        }
        this.scheduleReconnect();
      };
    } catch (err) {
      this.setStatus('DISCONNECTED');
      this.scheduleReconnect();
    }
  }

  private handleIncomingPayload(payload: any) {
    if (!payload) return;

    let alertItem: RealtimeAlert | null = null;

    if (payload.type === 'NEW_SECURITY_EVENT' && payload.data) {
      const d = payload.data;
      alertItem = {
        id: d.id || `live-${Date.now()}`,
        timestamp: d.timestamp || new Date().toISOString(),
        threat_category: d.threat_category || d.category || 'Network Threat',
        attack_type: d.alert_type || d.event_type || 'Observed Threat',
        source_ip: d.source_ip || '127.0.0.1',
        destination_ip: d.destination_ip || '127.0.0.1',
        source_port: d.source_port || 0,
        destination_port: d.destination_port || 0,
        protocol: d.protocol || 'TCP',
        confidence: typeof d.confidence === 'number' ? (d.confidence <= 1.0 ? d.confidence * 100 : d.confidence) : 90.0,
        severity: (d.severity || 'HIGH').toUpperCase() as any,
        risk_score: typeof d.risk_score === 'number' ? d.risk_score : 80.0,
        evidence: Array.isArray(d.evidence) ? d.evidence : [d.description || 'Observed telemetry anomaly'],
        description: d.description
      };
    } else if (payload.event === 'new_alert' && payload.data) {
      const d = payload.data;
      alertItem = {
        id: d.id || `alt-${Date.now()}`,
        timestamp: d.timestamp || new Date().toISOString(),
        threat_category: d.threat_category || 'Network Threat',
        attack_type: d.alert_type || 'Observed Attack',
        source_ip: d.source_ip || '127.0.0.1',
        destination_ip: d.destination_ip || '127.0.0.1',
        source_port: d.source_port,
        destination_port: d.destination_port,
        protocol: d.protocol || 'TCP',
        confidence: d.confidence || 90.0,
        severity: d.severity || 'HIGH',
        risk_score: d.risk_score || 80.0,
        evidence: d.evidence || [],
        description: d.description
      };
    }

    if (alertItem) {
      console.log('[THREATWAVE LIVE DETECTED]', alertItem.threat_category, alertItem.attack_type);
      this.alertListeners.forEach(fn => fn(alertItem!));
    }
  }

  private scheduleReconnect() {
    if (!this.isLiveMode || this.reconnectTimer) return;
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      if (this.isLiveMode) {
        console.log('[THREATWAVE REALTIME] Reconnecting to telemetry bus...');
        this.connect();
      }
    }, 4000);
  }

  public disconnect() {
    this.isLiveMode = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.sse) {
      this.sse.close();
      this.sse = null;
    }
    this.setStatus('DISCONNECTED');
  }
}

export const realtimeClient = new RealtimeStreamClient();
