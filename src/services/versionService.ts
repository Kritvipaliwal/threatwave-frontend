import { apiClient } from './api';
import type { SystemVersionInfo, SystemHealthStatus } from '../types';

export const versionService = {
  async getSystemVersion(): Promise<SystemVersionInfo> {
    try {
      const data = await apiClient.fetchWithTimeout<any>('/health');
      return {
        application: 'THREATWAVE',
        frontend_version: '2.1.0',
        backend_version: data.version || '2.1.0',
        schema_version: '2',
        api_version: 'v1',
        environment: data.environment || 'production',
        feature_flags: {
          attack_story: true,
          attack_graph: true,
          anomaly_center: true,
          ai_investigator: true,
          live_network_map: true
        }
      };
    } catch {
      return {
        application: 'THREATWAVE',
        frontend_version: '2.1.0',
        backend_version: '2.1.0 (Demo)',
        schema_version: '2',
        api_version: 'v1',
        environment: 'demo',
        feature_flags: {
          attack_story: true,
          attack_graph: true,
          anomaly_center: true,
          ai_investigator: true,
          live_network_map: true
        }
      };
    }
  },

  async getSystemHealth(): Promise<SystemHealthStatus> {
    try {
      const data = await apiClient.fetchWithTimeout<any>('/health');
      const isHealthy = data.status === 'healthy';
      const sensorOnline = data.sensor?.status === 'ONLINE';

      return {
        frontend: 'ONLINE',
        backend: isHealthy ? 'ONLINE' : 'DEGRADED',
        database: data.database === 'connected' ? 'ONLINE' : 'DEGRADED',
        zeekSensor: sensorOnline ? 'ONLINE' : 'SIMULATED',
        tshark: 'ONLINE',
        websocket: 'ONLINE',
        aiProvider: 'ONLINE',
        lastEventTime: data.sensor?.last_event_time || new Date().toISOString(),
        lastApiCall: new Date().toISOString(),
        eventsProcessed: data.sensor?.events_ingested || 12481,
        eventsPerSec: 42.8
      };
    } catch {
      return {
        frontend: 'ONLINE',
        backend: 'DEGRADED',
        database: 'OFFLINE',
        zeekSensor: 'SIMULATED',
        tshark: 'OFFLINE',
        websocket: 'ONLINE',
        aiProvider: 'STANDBY',
        lastEventTime: new Date().toISOString(),
        lastApiCall: new Date().toISOString(),
        eventsProcessed: 12481,
        eventsPerSec: 38.0
      };
    }
  }
};

export default versionService;
