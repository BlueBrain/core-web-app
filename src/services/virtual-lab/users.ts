import { TotalUsersResponse } from '@/types/virtual-lab/members';
import { virtualLabApi } from '@/config';
import authFetch from '@/authFetch';

export async function getTotalUsers(): Promise<TotalUsersResponse> {
  const response = await authFetch(`${virtualLabApi.url}/users_count`);

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}
