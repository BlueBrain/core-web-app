import { atom } from 'jotai';
import { fetchEsResourcesByType } from '@/api/explore-section/resources';
import fetchDataQuery from '@/queries/explore-section/data';
import { DataType } from '@/constants/explore-section/list-views';

export const getTotalByType = (dataType: DataType) =>
  atom<Promise<number | null>>(async () => {
    const query = fetchDataQuery(0, 0, [], dataType);
    const response = await fetchEsResourcesByType(query);
    return response?.total?.value;
  });
