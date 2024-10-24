import { virtualLabApi } from '@/config';
import { VirtualLab, VirtualLabResponse } from '@/types/virtual-lab/lab';
import { VirtualLabAPIListData, VlmResponse } from '@/types/virtual-lab/common';
import { UsersResponse } from '@/types/virtual-lab/members';
import authFetch, { authFetchRetryOnError } from '@/authFetch';
import { assertVLApiResponse } from '@/util/utils';
import { VirtualLabWithOptionalId } from '@/components/VirtualLab/CreateVirtualLabButton/types';

export async function getVirtualLabDetail(id: string): Promise<VirtualLabResponse> {
  const response = await authFetchRetryOnError(`${virtualLabApi.url}/virtual-labs/${id}`);

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function getVirtualLabUsers(virtualLabId: string): Promise<UsersResponse> {
  const response = await authFetchRetryOnError(
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
  const response = await authFetchRetryOnError(`${virtualLabApi.url}/virtual-labs`);

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function patchVirtualLab(
  partialVlab: Partial<VirtualLab>,
  id: string
): Promise<
  VlmResponse<{
    virtual_lab: VirtualLab;
  }>
> {
  const res = await authFetch(`${virtualLabApi.url}/virtual-labs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partialVlab),
  });

  return assertVLApiResponse(res);
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
  lab: VirtualLabWithOptionalId;
}): Promise<VlmResponse<{ virtual_lab: VirtualLab }>> {
  const response = await authFetch(`${virtualLabApi.url}/virtual-labs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lab),
  });

  return assertVLApiResponse(response);
}
