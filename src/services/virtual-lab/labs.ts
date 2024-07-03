import { virtualLabApi } from '@/config';
import { VirtualLab, VirtualLabResponse } from '@/types/virtual-lab/lab';
import { VirtualLabAPIListData, VlmResponse } from '@/types/virtual-lab/common';
import { UsersResponse } from '@/types/virtual-lab/members';
import authFetch from '@/authFetch';
import { assertVLApiResponse } from '@/util/utils';

export async function getVirtualLabDetail(id: string): Promise<VirtualLabResponse | null> {
  const response = await authFetch(`${virtualLabApi.url}/virtual-labs/${id}`);

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function getVirtualLabUsers(virtualLabId: string): Promise<UsersResponse> {
  const response = await authFetch(`${virtualLabApi.url}/virtual-labs/${virtualLabId}/users`);
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function getVirtualLabsOfUser(): Promise<
  VlmResponse<VirtualLabAPIListData<VirtualLab>>
> {
  const response = await authFetch(`${virtualLabApi.url}/virtual-labs`);
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
  return authFetch(`${virtualLabApi.url}/virtual-labs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  }).then(async (response) => {
    if (!response.ok) {
      const { details, message } = await response.json();

      throw new Error(message, { cause: details });
    }

    return response.json();
  });
}

export async function deleteVirtualLab(id: string): Promise<
  VlmResponse<{
    virtual_lab: VirtualLab;
  }>
> {
  const response = await authFetch(`${virtualLabApi.url}/virtual-labs/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
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
  const response = await authFetch(`${virtualLabApi.url}/plans`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  return response.json();
}

export async function createVirtualLab({
  lab,
}: {
  lab: Partial<VirtualLab>;
}): Promise<VlmResponse<{ virtual_lab: VirtualLab }>> {
  const response = await authFetch(`${virtualLabApi.url}/virtual-labs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lab),
  });

  return assertVLApiResponse(response);
}
