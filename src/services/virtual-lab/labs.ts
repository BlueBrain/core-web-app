import { createVLApiHeaders } from './common';
import { virtualLabApi } from '@/config';
import { VirtualLab, VirtualLabResponse } from '@/types/virtual-lab/lab';
import { VirtualLabAPIListData, VlmResponse } from '@/types/virtual-lab/common';
import { UsersResponse } from '@/types/virtual-lab/members';

export async function getVirtualLabDetail(id: string, token: string): Promise<VirtualLabResponse> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}`, {
    method: 'GET',
    headers: createVLApiHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function getVirtualLabUsers(
  virtualLabId: string,
  token: string
): Promise<UsersResponse> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${virtualLabId}/users`, {
    method: 'GET',
    headers: createVLApiHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function getVirtualLabsOfUser(
  token: string
): Promise<VlmResponse<VirtualLabAPIListData<VirtualLab>>> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs`, {
    method: 'GET',
    headers: createVLApiHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function patchVirtualLab(
  formData: Partial<VirtualLab>,
  id: string,
  token: string
): Promise<
  VlmResponse<{
    virtual_lab: VirtualLab;
  }>
> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}`, {
    method: 'PATCH',
    headers: { ...createVLApiHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  return response.json();
}

export async function deleteVirtualLab(
  id: string,
  token: string
): Promise<
  VlmResponse<{
    virtual_lab: VirtualLab;
  }>
> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}`, {
    method: 'DELETE',
    headers: { ...createVLApiHeaders(token), 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  return response.json();
}

export async function getPlans(token: string): Promise<
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
    headers: { ...createVLApiHeaders(token), 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  return response.json();
}

export async function createVirtualLab({
  lab,
  token,
}: {
  lab: Partial<VirtualLab>;
  token: string;
}): Promise<VlmResponse<{ virtual_lab: VirtualLab }>> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs`, {
    method: 'POST',
    headers: { ...createVLApiHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(lab),
  });

  if (response.ok) {
    return response.json();
  }

  if (response.status === 400) {
    const { message } = await response.json();

    throw new Error(message);
  }

  throw new Error(`Undocumented error, ${response.status}`);
}
