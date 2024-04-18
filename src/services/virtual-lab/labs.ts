import { createVLApiHeaders } from './common';
import { temporaryToken } from './temporaryToken';
import { virtualLabApi } from '@/config';
import { VirtualLab, VirtualLabResponse } from '@/types/virtual-lab/lab';
import { VirtualLabAPIListData, VlmResponse } from '@/types/virtual-lab/common';
import { UsersResponse } from '@/types/virtual-lab/members';

export async function getVirtualLabDetail(id: string): Promise<VirtualLabResponse> {
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

export async function patchVirtualLab(
  formData: Partial<VirtualLab>,
  id: string
): Promise<
  VlmResponse<{
    virtual_lab: VirtualLab;
  }>
> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}`, {
    method: 'PATCH',
    headers: { ...createVLApiHeaders(temporaryToken), 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  return response.json();
}

export async function deleteVirtualLab(id: string): Promise<
  VlmResponse<{
    virtual_lab: VirtualLab;
  }>
> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}`, {
    method: 'DELETE',
    headers: { ...createVLApiHeaders(temporaryToken), 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  return response.json();
}

export async function getPlans(): Promise<
  VlmResponse<{
    all_plans: [
      {
        id: number;
        name: string;
        price: number;
        features: Record<string, Array<string>>;
      },
    ];
  }>
> {
  const response = await fetch(`${virtualLabApi.url}/plans`, {
    method: 'GET',
    headers: { ...createVLApiHeaders(temporaryToken), 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  return response.json();
}
