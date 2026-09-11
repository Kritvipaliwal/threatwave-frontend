/**
 * THREATWAVE LIVE TELEMETRY & WEBSOCKET ABSTRACTION
 *
 * Connects directly to FastAPI backend WebSocket:
 * - ws://127.0.0.1:8000/ws (configurable via VITE_WS_URL)
 *
 * Emits strictly real telemetry events received from the sensor pipeline.
 * Does NOT generate synthetic or mock security events.
 */

import { SecurityEvent } from '../types';

export type RealtimeEventType = 
  | 'new_security_event'
  | 'new_threat'
  | 'threat_severity_update'
  | 'incident_creation'
  | 'incident_update'
  | 'risk_score_update'
  | 'attack_graph_update'
  | 'ai_analysis_completion'
  | 'response_status_update'
  | 'telemetry_update'
  | 'connection_change';

export interface TelemetryStats {
  eventsPerSec: number;
  packetsPerSec: number;
  totalEvents: number;
  criticalThreats: number;
  activeThreats: number;
  riskScore: number;
  fusedConfidence: number;
  sensorConnected: boolean;
  statusText: string;
}

type EventCallback = (data: any) => void;

class RealtimeService {
  private ws: WebSocket | null = null;
  private listeners: Map<RealtimeEventType, Set<EventCallback>> = new Map();
  private isConnected: boolean = false;
  private reconnectTimer: any = null;

  private stats: TelemetryStats = {
    eventsPerSec: 0.0,
    packetsPerSec: 0.0,
    totalEvents: 0,
    criticalThreats: 0,
    activeThreats: 0,
    riskScore: 0.0,
    fusedConfidence: 0.0,
    sensorConnected: false,
    statusText: 'CONNECTING TO TELEMETRY SENSOR...'
  };

  constructor() {
    this.initRealtimeConnection();
  }

  // Subscribe to typed events
  public on(event: RealtimeEventType, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  // Emit event to subscribers
  public emit(event: RealtimeEventType, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in realtime listener for ${event}:`, err);
        }
      });
    }
  }

  public getStats(): TelemetryStats {
    return { ...this.stats };
  }

  // Connect to live backend WebSocket
  private initRealtimeConnection(): void {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://127.0.0.1:8000/ws';

    if (typeof WebSocket !== 'undefined') {
      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.isConnected = true;
          this.stats.sensorConnected = true;
          this.stats.statusText = 'LIVE TELEMETRY BUS CONNECTED';
          this.emit('connection_change', { connected: true, mode: 'LIVE_WEBSOCKET' });
        };

        this.ws.onmessage = (e) => {
          try {
            const msg = JSON.parse(e.data);
            const msgType = msg.type || msg.event;
            
            if (msgType === 'NEW_SECURITY_EVENT' || msgType === 'new_alert' || msgType === 'new_detection') {
              const ev = msg.data;
              const formattedEvent: SecurityEvent = {
                id: ev.id || `ev-${Date.now()}`,
                timestamp: ev.timestamp ? (ev.timestamp.includes('T') ? new Date(ev.timestamp).toLocaleTimeString() : ev.timestamp) : new Date().toLocaleTimeString(),
                sourceIp: ev.source_ip || ev.sourceIp || '0.0.0.0',
                destinationIp: ev.destination_ip || ev.destinationIp || '0.0.0.0',
                port: ev.destination_port || ev.port || 443,
                protocol: ev.protocol || 'TCP',
                attackType: ev.alert_type || ev.threat_category || ev.event_type || 'Observed Telemetry Flow',
                severity: ev.severity || 'HIGH',
                confidence: ev.confidence ? (ev.confidence > 1.0 ? ev.confidence / 100.0 : ev.confidence) : 0.95,
                description: ev.description || 'Passive sensor observed flow signature',
                category: ev.threat_category || ev.category || 'NETWORK',
                riskScore: ev.risk_score || ev.riskScore || 75.0
              };
              this.stats.totalEvents += 1;
              if (ev.severity === 'CRITICAL') this.stats.criticalThreats += 1;
              this.stats.activeThreats += 1;
              this.emit('new_security_event', formattedEvent);
              this.emit('new_threat', formattedEvent);
            } else if (msgType === 'TELEMETRY_UPDATE' || msgType === 'metric_update') {
              this.stats.eventsPerSec = msg.data.eps ?? msg.data.events_per_sec ?? this.stats.eventsPerSec;
              this.stats.packetsPerSec = msg.data.pps ?? msg.data.packets_per_sec ?? this.stats.packetsPerSec;
              this.stats.activeThreats = msg.data.active_threats ?? this.stats.activeThreats;
              this.emit('telemetry_update', msg.data);
            } else if (msgType === 'INCIDENT_UPDATE' || msgType === 'attack_update') {
              this.emit('incident_update', msg.data);
              if (msg.data.risk_score !== undefined) {
                this.emit('risk_score_update', { riskScore: msg.data.risk_score });
              }
            } else if (msgType === 'NEW_THREAT') {
              this.emit('new_threat', msg.data);
            }
          } catch {
            // Ignore unparseable frames
          }
        };

        this.ws.onerror = () => {
          this.stats.sensorConnected = false;
          this.stats.statusText = 'TELEMETRY SENSOR OFFLINE';
          this.emit('connection_change', { connected: false, mode: 'OFFLINE' });
        };

        this.ws.onclose = () => {
          this.isConnected = false;
          this.stats.sensorConnected = false;
          this.stats.statusText = 'RECONNECTING TO SENSOR...';
          this.emit('connection_change', { connected: false, mode: 'RECONNECTING' });
          
          // Reconnect attempt every 6 seconds
          if (!this.reconnectTimer) {
            this.reconnectTimer = setTimeout(() => {
              this.reconnectTimer = null;
              this.initRealtimeConnection();
            }, 6000);
          }
        };
      } catch {
        this.stats.sensorConnected = false;
        this.stats.statusText = 'TELEMETRY DISCONNECTED';
        this.emit('connection_change', { connected: false, mode: 'OFFLINE' });
      }
    }
  }

  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}

export const realtimeService = new RealtimeService();
export default realtimeService;
