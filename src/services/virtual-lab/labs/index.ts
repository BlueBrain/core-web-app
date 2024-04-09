import { virtualLabApi } from '@/config';
import { VirtualLabResponse } from '@/types/virtual-lab/lab';

const accessToken = 'Bearer ';

export default async function getVirtualLabDetail(id: string): Promise<VirtualLabResponse> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}`, {
    method: 'GET',
    headers: { Authorization: accessToken, accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}
