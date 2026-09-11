import { apiClient, DashboardResponse } from './api';

export interface TelemetryPoint {
  timestamp: string;
  pps: number;
  eps: number;
  threat_count: number;
}

export const telemetryService = {
  async getDashboardMetrics(): Promise<DashboardResponse> {
    return apiClient.getDashboard();
  },

  async getTelemetrySeries(): Promise<TelemetryPoint[]> {
    try {
      const data = await apiClient.fetchWithTimeout<{ points: TelemetryPoint[] }>('/dashboard/telemetry');
      if (data && data.points && data.points.length > 0) {
        return data.points;
      }
    } catch {
      // Fallback
    }

    const now = new Date();
    const points: TelemetryPoint[] = [];
    for (let i = 12; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 5000);
      points.push({
        timestamp: t.toLocaleTimeString(),
        pps: 1350 + Math.floor(Math.random() * 80),
        eps: 38 + Math.floor(Math.random() * 12),
        threat_count: 3
      });
    }
    return points;
  },

  async getHealth(): Promise<any> {
    try {
      return await apiClient.fetchWithTimeout<any>('/health');
    } catch {
      return {
        status: 'degraded',
        database: 'offline',
        sensor: { status: 'SIMULATED', name: 'Zeek Passive Sensor' },
        demo_mode: true
      };
    }
  }
};

export default telemetryService;
