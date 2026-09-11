import { apiClient } from './api';
import type { SecurityEvent } from '../types';
import type { ThreatProfile } from '../data/demoData';

export const threatService = {
  async getThreats(): Promise<ThreatProfile[]> {
    return apiClient.getThreats();
  },

  async getThreatById(id: string): Promise<ThreatProfile | null> {
    try {
      const data = await apiClient.fetchWithTimeout<ThreatProfile>(`/threats/${encodeURIComponent(id)}`);
      return data;
    } catch {
      const threats = await apiClient.getThreats();
      return threats.find(t => t.id === id) || threats[0] || null;
    }
  },

  async getEvents(limit: number = 50): Promise<SecurityEvent[]> {
    return apiClient.getEvents(limit);
  }
};

export default threatService;
