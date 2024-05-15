import { atom } from 'jotai';
import sessionAtom from '../session';
import { getTotalUsers } from '@/services/virtual-lab/users';

export const virtualLabTotalUsersAtom = atom<Promise<number | undefined>>(async (get) => {
  const session = get(sessionAtom);
  if (!session) {
    return;
  }
  const response = await getTotalUsers(session.accessToken);
  return response.data.total;
});
