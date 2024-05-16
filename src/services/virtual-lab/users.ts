import { createVLApiHeaders } from './common';
import { TotalUsersResponse } from '@/types/virtual-lab/members';
import { virtualLabApi } from '@/config';

export async function getTotalUsers(token: string): Promise<TotalUsersResponse> {
  const response = await fetch(`${virtualLabApi.url}/users_count`, {
    method: 'GET',
    headers: createVLApiHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}
