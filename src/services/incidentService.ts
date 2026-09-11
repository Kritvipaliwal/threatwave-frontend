import { apiClient } from './api';
import type { Incident } from '../types';

export const incidentService = {
  async getIncidents(): Promise<Incident[]> {
    return apiClient.getIncidents();
  },

  async getIncidentById(id: string): Promise<Incident | null> {
    try {
      return await apiClient.fetchWithTimeout<Incident>(`/incidents/${encodeURIComponent(id)}`);
    } catch {
      const incs = await apiClient.getIncidents();
      return incs.find(i => i.id === id || (i as any).code === id) || incs[0] || null;
    }
  },

  async approveResponseAction(
    incidentId: string,
    action: string,
    target: string,
    reason: string = 'Authorized by SecOps analyst'
  ): Promise<any> {
    return apiClient.approveResponse(incidentId, action, target, reason);
  }
};

export default incidentService;
