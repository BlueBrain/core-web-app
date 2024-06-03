import { atom } from 'jotai';

import { MEModelResource } from '@/types/me-model';
import sessionAtom from '@/state/session';
import { getNotValidatedMEModelQuery } from '@/queries/es';
import { queryES } from '@/api/nexus';

export const notValidatedMEModelsAtom = atom<Promise<MEModelResource[] | undefined>>(
  async (get) => {
    const session = get(sessionAtom);

    if (!session) return;

    const query = getNotValidatedMEModelQuery(session.user.username);
    return queryES<MEModelResource>(query, session);
  }
);
