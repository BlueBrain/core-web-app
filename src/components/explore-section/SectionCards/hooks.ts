import { atom } from 'jotai';
import fetchEsResourcesByType from '@/api/explore-section/resources';
import fetchDataQuery from '@/queries/explore-section/data';
import sessionAtom from '@/state/session';

export const getTotalByType = (type: string) =>
  atom<Promise<number | null>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;

    const query = fetchDataQuery(0, 0, [], type);
    const response = await fetchEsResourcesByType(session.accessToken, query);
    return response?.total?.value;
  });
