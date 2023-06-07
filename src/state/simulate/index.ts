import { atom } from 'jotai';

import sessionAtom from '@/state/session';
import { SimulationCampaignUIConfigResource } from '@/types/nexus';
import { queryES } from '@/api/nexus';
import { getPersonalSimCampConfigsQuery, getSimCampConfigsQuery } from '@/queries/es';

export const refetchTriggerAtom = atom<{}>({});
export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

export const campaignNameAtom = atom('');
export const campaignDescriptionAtom = atom('');

export const searchSimCampUIConfigListStringAtom = atom<string>('');

type SearchType = 'public' | 'personal';

export const searchConfigListTypeAtom = atom<SearchType>('public');

export const simCampaingListAtom = atom<Promise<SimulationCampaignUIConfigResource[]>>(
  async (get) => {
    const session = get(sessionAtom);
    const searchType = get(searchConfigListTypeAtom);
    const searchString = get(searchSimCampUIConfigListStringAtom);

    get(refetchTriggerAtom);

    if (!session) return [];

    let query;

    if (searchType === 'public') {
      query = getSimCampConfigsQuery(searchString);
    } else if (searchType === 'personal') {
      query = getPersonalSimCampConfigsQuery(session.user.username, searchString);
    } else {
      throw new Error('SearchType is not supported');
    }

    return queryES<SimulationCampaignUIConfigResource>(query, session);
  }
);
