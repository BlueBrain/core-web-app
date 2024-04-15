import { createVLApiHeaders } from './common';
import { temporaryToken } from './temporaryToken';
import { virtualLabApi } from '@/config';
import { Project } from '@/types/virtual-lab/projects';
import { VirtualLabAPIListData, VlmResponse } from '@/types/virtual-lab/common';

export async function getVirtualLabProjects(
  id: string
): Promise<VlmResponse<VirtualLabAPIListData<Project>>> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}/projects`, {
    method: 'GET',
    headers: createVLApiHeaders(temporaryToken),
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}