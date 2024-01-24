import { atom } from 'jotai';
import { fetchEsResourcesByType } from '@/api/explore-section/resources';
import fetchDataQuery from '@/queries/explore-section/data';
import sessionAtom from '@/state/session';
import { DataType } from '@/constants/explore-section/list-views';

export const getTotalByType = (dataType: DataType) =>
  atom<Promise<number | null>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;

    const query = fetchDataQuery(0, 0, [], dataType);
    const response = await fetchEsResourcesByType(session.accessToken, query);
    return response?.total?.value;
  });
