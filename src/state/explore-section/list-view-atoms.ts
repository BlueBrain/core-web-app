import { Atom, atom } from 'jotai';
import { atomWithDefault, atomFamily } from 'jotai/utils';
import uniq from 'lodash/uniq';
import columnKeyToFilter from './column-key-to-filter';
import { ExploreDataBrainRegionSource, SortState } from '@/types/explore-section/application';
import fetchDataQuery from '@/queries/explore-section/data';
import {
  DataQuery,
  fetchEsResourcesByType,
  fetchDimensionAggs,
  fetchTotalByExperimentAndRegions,
} from '@/api/explore-section/resources';
import sessionAtom from '@/state/session';
import {
  PAGE_SIZE,
  PAGE_NUMBER,
  SIMULATION_CAMPAIGNS,
} from '@/constants/explore-section/list-views';
import { FlattenedExploreESResponse, ExploreESHit } from '@/types/explore-section/es';
import { BrainRegion } from '@/types/ontologies';
import { Filter } from '@/components/Filter/types';
import { getBrainRegionDescendants } from '@/state/brain-regions/descendants';
import { BASIC_CELL_GROUPS_AND_REGIONS_ID } from '@/constants/brain-hierarchy';
import { visibleBrainRegionsAtom } from '@/state/brain-regions';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/experiment-types';

type DataAtomFamilyScopeType = {
  experimentTypeName: string;
  brainRegionSource?: ExploreDataBrainRegionSource;
  resourceId?: string;
};

const isListAtomEqual = (a: DataAtomFamilyScopeType, b: DataAtomFamilyScopeType): boolean =>
  // eslint-disable-next-line lodash/prefer-matches
  a.experimentTypeName === b.experimentTypeName &&
  a.brainRegionSource === b.brainRegionSource &&
  a.resourceId === b.resourceId;

export const pageSizeAtom = atom<number>(PAGE_SIZE);

export const pageNumberAtom = atomFamily(() => atom<number>(PAGE_NUMBER), isListAtomEqual);

export const selectedRowsAtom = atomFamily(() => atom<ExploreESHit[]>([]), isListAtomEqual);

export const searchStringAtom = atomFamily(() => atom<string>(''), isListAtomEqual);

export const sortStateAtom = atom<SortState | undefined>({ field: 'createdAt', order: 'desc' });

export const activeColumnsAtom = atomFamily(
  ({ experimentTypeName }: DataAtomFamilyScopeType) =>
    atomWithDefault<Promise<string[]>>(async (get) => {
      const dimensionColumns = await get(dimensionColumnsAtom({ experimentTypeName }));
      return [
        'index',
        ...(dimensionColumns || []),
        ...EXPERIMENT_DATA_TYPES[experimentTypeName].columns,
      ];
    }),
  isListAtomEqual
);

export const dimensionColumnsAtom = atomFamily(({ experimentTypeName }: DataAtomFamilyScopeType) =>
  atom<Promise<string[] | null>>(async (get) => {
    const session = get(sessionAtom);

    // if the type is not simulation campaign, we dont fetch dimension columns
    if (!session || experimentTypeName !== SIMULATION_CAMPAIGNS) {
      return null;
    }
    const dimensionsResponse = await fetchDimensionAggs(session?.accessToken);
    const dimensions: string[] = [];
    dimensionsResponse.hits.forEach((response: any) => {
      if (response._source.parameter?.coords) {
        dimensions.push(...Object.keys(response._source.parameter?.coords));
      }
    });

    return uniq(dimensions);
  })
);

export const filtersAtom = atomFamily(
  ({ experimentTypeName }: DataAtomFamilyScopeType) =>
    atomWithDefault<Promise<Filter[]>>(async (get) => {
      const columnsKeys = EXPERIMENT_DATA_TYPES[experimentTypeName].columns;
      const dimensionsColumns = await get(dimensionColumnsAtom({ experimentTypeName }));
      return [
        ...columnsKeys.map((colKey) => columnKeyToFilter(colKey)),
        ...(dimensionsColumns || []).map(
          (dimension) =>
            ({
              field: dimension,
              type: 'valueOrRange',
              value: { gte: null, lte: null },
              aggregationType: 'stats',
            } as Filter)
        ),
      ];
    }),
  isListAtomEqual
);

export const brainRegionDescendantsAtom = atom<Promise<BrainRegion[]>>(async (get) => {
  const visibleBrainRegions = get(visibleBrainRegionsAtom('explore'));
  const brainRegionDescendants = await get(
    getBrainRegionDescendants(
      visibleBrainRegions.length > 0 ? visibleBrainRegions : [BASIC_CELL_GROUPS_AND_REGIONS_ID]
    )
  );
  return brainRegionDescendants || [];
});

export const descendantIdsAtom = atom(async (get) => {
  const brainRegionDescendants = await get(brainRegionDescendantsAtom);

  return brainRegionDescendants?.map((d) => d.id) || [];
});

export const totalByExperimentAndRegionsAtom = atomFamily(
  ({ experimentTypeName, brainRegionSource }: DataAtomFamilyScopeType) =>
    atom<Promise<number | undefined | null>>(async (get) => {
      const session = get(sessionAtom);

      if (!session) return null;

      const sortState = get(sortStateAtom);
      let descendantIds: string[] = [];
      // if the source of brain sources are the visible ones, we fill with descendants
      if (brainRegionSource === 'visible') {
        descendantIds = await get(descendantIdsAtom);
      }
      const query = fetchDataQuery(0, 1, [], experimentTypeName, sortState, '', descendantIds);

      const result = query && (await fetchTotalByExperimentAndRegions(session.accessToken, query));

      return result;
    }),
  isListAtomEqual
);

export const queryAtom = atomFamily(
  ({ experimentTypeName, brainRegionSource }: DataAtomFamilyScopeType) =>
    atom<Promise<DataQuery | null>>(async (get) => {
      const searchString = get(searchStringAtom({ experimentTypeName }));
      const pageNumber = get(pageNumberAtom({ experimentTypeName }));
      const pageSize = get(pageSizeAtom);
      const sortState = get(sortStateAtom);

      let descendantIds: string[] = [];
      // if the source of brain sources are the visible ones, we fill with descendants
      if (brainRegionSource === 'visible') {
        descendantIds = await get(descendantIdsAtom);
      }

      const filters = await get(filtersAtom({ experimentTypeName }));

      if (!filters) {
        return null;
      }

      return fetchDataQuery(
        pageSize,
        pageNumber,
        filters,
        experimentTypeName,
        sortState,
        searchString,
        descendantIds
      );
    }),
  isListAtomEqual
);

export const queryResponseAtom = atomFamily(
  ({ experimentTypeName, brainRegionSource }: DataAtomFamilyScopeType) =>
    atom<Promise<FlattenedExploreESResponse | null>>(async (get) => {
      const session = get(sessionAtom);

      if (!session) return null;

      const query = await get(queryAtom({ experimentTypeName, brainRegionSource }));
      const result = query && (await fetchEsResourcesByType(session.accessToken, query));

      return result;
    }),
  isListAtomEqual
);

export const dataAtom = atomFamily<DataAtomFamilyScopeType, Atom<Promise<ExploreESHit[]>>>(
  ({ experimentTypeName, brainRegionSource }) =>
    atom(async (get) => {
      const response = await get(queryResponseAtom({ experimentTypeName, brainRegionSource }));

      if (response?.hits) {
        return response.hits;
      }

      return [];
    }),
  isListAtomEqual
);

export const totalAtom = atomFamily(
  ({ experimentTypeName, brainRegionSource }: DataAtomFamilyScopeType) =>
    atom(async (get) => {
      const response = await get(queryResponseAtom({ experimentTypeName, brainRegionSource }));
      const { total } = response ?? {
        total: { value: 0 },
      };
      return total?.value;
    }),
  isListAtomEqual
);

export const aggregationsAtom = atomFamily(
  ({ experimentTypeName, brainRegionSource }: DataAtomFamilyScopeType) =>
    atom<Promise<FlattenedExploreESResponse['aggs'] | undefined>>(async (get) => {
      const response = await get(queryResponseAtom({ experimentTypeName, brainRegionSource }));
      return response?.aggs;
    }),
  isListAtomEqual
);
