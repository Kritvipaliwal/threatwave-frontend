import { apiClient } from './api';
import type { AttackStoryResponse, AttackGraphResponse } from '../types';

export const attackGraphService = {
  async getAttackStory(incidentId: string = 'THR-1042'): Promise<AttackStoryResponse> {
    return apiClient.getAttackStory(incidentId);
  },

  async getAttackGraph(incidentId: string = 'THR-1042'): Promise<AttackGraphResponse> {
    return apiClient.getAttackGraph(incidentId);
  }
};

export default attackGraphService;
