import { createVLApiHeaders } from './common';
import { temporaryToken } from './temporaryToken';
import { virtualLabApi } from '@/config';
import { VirtualLab, VirtualLabResponse } from '@/types/virtual-lab/lab';
import { VirtualLabAPIListData, VlmResponse } from '@/types/virtual-lab/common';
import { UsersResponse } from '@/types/virtual-lab/members';

export async function getVirtualLabDetail(id: string): Promise<VirtualLabResponse> {
  console.log('🚀 ~ getVirtualLabDetail ~ temporaryToken:', temporaryToken);
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}`, {
    method: 'GET',
    headers: createVLApiHeaders(temporaryToken),
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function getVirtualLabUsers(virtualLabId: string): Promise<UsersResponse> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${virtualLabId}/users`, {
    method: 'GET',
    headers: createVLApiHeaders(temporaryToken),
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
    headers: createVLApiHeaders(temporaryToken),
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}
