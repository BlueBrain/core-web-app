import { virtualLabApi } from '@/config';
import { VirtualLab, VirtualLabResponse } from '@/types/virtual-lab/lab';
import { Project } from '@/types/virtual-lab/projects';
import { VirtualLabAPIListData, VlmResponse } from '@/types/virtual-lab/common';

// Add the bearer token from the frontend below
// This constant will be replaced by the actual login token as soon as login is implemented
const accessToken = 'Bearer <TOKEN>';

export async function getVirtualLabDetail(id: string): Promise<VirtualLabResponse> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}`, {
    method: 'GET',
    headers: { Authorization: accessToken, accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function getVirtualLabsOfUser(): Promise<
  VlmResponse<VirtualLabAPIListData<VirtualLab>>
> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs`, {
    method: 'GET',
    headers: { Authorization: accessToken, accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function getVirtualLabProjects(
  id: string
): Promise<VlmResponse<VirtualLabAPIListData<Project>>> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}/projects`, {
    method: 'GET',
    headers: { Authorization: accessToken, accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}
