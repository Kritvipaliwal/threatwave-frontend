import { apiClient } from './api';
import type { AIInvestigateResponse, AIChatResponse } from '../types';

export const aiService = {
  async investigateIncident(incidentId: string = 'THR-1042'): Promise<AIInvestigateResponse> {
    return apiClient.investigateAI(incidentId);
  },

  async chatCopilot(message: string, incidentId: string = 'THR-1042'): Promise<AIChatResponse> {
    return apiClient.chatCopilot(message, incidentId);
  }
};

export default aiService;
