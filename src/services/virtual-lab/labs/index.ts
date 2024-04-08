import { VirtualLabResponse } from '@/types/virtual-lab/lab';

const accessToken = 'Bearer ';

export default async function getVirtualLabDetail(id: string): Promise<VirtualLabResponse> {
  const response = await fetch(`http://localhost:8000/virtual-labs/${id}`, {
    method: 'GET',
    headers: { Authorization: accessToken, accept: 'application/json' },
  });
  return response.json();
}
