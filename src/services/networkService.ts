import { apiClient } from './api';
import type { NetworkMapResponse } from '../types';

export const networkService = {
  async getNetworkMap(): Promise<NetworkMapResponse> {
    return apiClient.getNetworkMap();
  }
};

export default networkService;
