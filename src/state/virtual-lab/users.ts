import { atom } from 'jotai';
import { getTotalUsers } from '@/services/virtual-lab/users';

export const virtualLabTotalUsersAtom = atom<Promise<number | undefined>>(async () => {
  const response = await getTotalUsers();
  return response.data.total;
});
