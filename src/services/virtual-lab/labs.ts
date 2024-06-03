import { createApiHeaders } from './common';
import { virtualLabApi } from '@/config';
import { VirtualLab, VirtualLabResponse } from '@/types/virtual-lab/lab';
import { VirtualLabAPIListData, VlmResponse } from '@/types/virtual-lab/common';
import { UsersResponse } from '@/types/virtual-lab/members';
import { fetchWithSession } from '@/util/utils';

export async function getVirtualLabDetail(id: string): Promise<VirtualLabResponse> {
  const response = await fetchWithSession(`${virtualLabApi.url}/virtual-labs/${id}`);

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function getVirtualLabUsers(virtualLabId: string): Promise<UsersResponse> {
  const response = await fetchWithSession(
    `${virtualLabApi.url}/virtual-labs/${virtualLabId}/users`
  );
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function getVirtualLabsOfUser(): Promise<
  VlmResponse<VirtualLabAPIListData<VirtualLab>>
> {
  const response = await fetchWithSession(`${virtualLabApi.url}/virtual-labs`);
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
  return fetch(`${virtualLabApi.url}/virtual-labs/${id}`, {
    method: 'PATCH',
    headers: { ...createApiHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  }).then(async (response) => {
    if (!response.ok) {
      const { details, message } = await response.json();

      throw new Error(message, { cause: details });
    }

    return response.json();
  });
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
    headers: { ...createApiHeaders(token), 'Content-Type': 'application/json' },
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
    headers: { ...createApiHeaders(token), 'Content-Type': 'application/json' },
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
    headers: { ...createApiHeaders(token), 'Content-Type': 'application/json' },
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
