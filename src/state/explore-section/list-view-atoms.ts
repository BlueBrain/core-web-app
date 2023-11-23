import { atom } from 'jotai';
import { atomWithDefault, atomFamily, selectAtom } from 'jotai/utils';
import uniq from 'lodash/uniq';
import isEqual from 'lodash/isEqual';
import columnKeyToFilter from './column-key-to-filter';
import { ExploreDataBrainRegionSource, SortState } from '@/types/explore-section/application';
import fetchDataQuery from '@/queries/explore-section/data';
import {
  DataQuery,
  fetchEsResourcesByType,
  fetchDimensionAggs,
} from '@/api/explore-section/resources';
import sessionAtom from '@/state/session';
import {
  PAGE_SIZE,
  PAGE_NUMBER,
  SIMULATION_CAMPAIGNS,
} from '@/constants/explore-section/list-views';
import { typeToColumns } from '@/state/explore-section/type-to-columns';
import { FlattenedExploreESResponse, ExploreESHit } from '@/types/explore-section/es';
import { Filter } from '@/components/Filter/types';
import { getBrainRegionDescendants } from '@/state/brain-regions/descendants';
import { BASIC_CELL_GROUPS_AND_REGIONS_ID } from '@/constants/brain-hierarchy';
import { visibleBrainRegionsAtom } from '@/state/brain-regions';

type DataAtomFamilyScopeType = {
  experimentTypeName: string;
  brainRegionSource?: ExploreDataBrainRegionSource;
  resourceId?: string;
};

export const pageSizeAtom = atom<number>(PAGE_SIZE);

export const pageNumberAtom = atomFamily(() => atom<number>(PAGE_NUMBER), isEqual);

export const selectedRowsAtom = atomFamily(() => atom<ExploreESHit[]>([]), isEqual);

export const searchStringAtom = atomFamily(() => atom<string>(''), isEqual);

export const sortStateAtom = atom<SortState | undefined>({ field: 'createdAt', order: 'desc' });

export const activeColumnsAtom = atomFamily(
  ({ experimentTypeName }: DataAtomFamilyScopeType) =>
    atomWithDefault<Promise<string[]>>(async (get) => {
      const dimensionColumns = await get(dimensionColumnsAtom({ experimentTypeName }));
      return ['index', ...(dimensionColumns || []), ...typeToColumns[experimentTypeName]];
    }),
  isEqual
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
      const columnsKeys = typeToColumns[experimentTypeName];
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
  isEqual
);

export const queryAtom = atomFamily(
  ({ experimentTypeName, brainRegionSource }: DataAtomFamilyScopeType) =>
    atom<Promise<DataQuery | null>>(async (get) => {
      const searchString = get(searchStringAtom({ experimentTypeName }));
      const pageNumber = get(pageNumberAtom({ experimentTypeName }));
      const pageSize = get(pageSizeAtom);
      const sortState = get(sortStateAtom);
      const visibleBrainRegions = get(visibleBrainRegionsAtom('explore'));

      let descendantIds: string[] = [];
      // if the source of brain sources are the visible ones, we fill with descendants
      if (brainRegionSource === 'visible') {
        const descendants = await get(
          getBrainRegionDescendants(
            visibleBrainRegions.length > 0
              ? visibleBrainRegions
              : [BASIC_CELL_GROUPS_AND_REGIONS_ID]
          )
        );
        descendantIds = descendants?.map((d) => d.id) || [];
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
  isEqual
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
  isEqual
);

export const dataAtom = atomFamily(
  ({ experimentTypeName, brainRegionSource }: DataAtomFamilyScopeType) =>
    atom(async (get) => {
      const response = await get(queryResponseAtom({ experimentTypeName, brainRegionSource }));
      if (response?.hits) {
        return response.hits;
      }
      return [];
    }),
  isEqual
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
  isEqual
);

export const aggregationsAtom = atomFamily(
  ({ experimentTypeName, brainRegionSource }: DataAtomFamilyScopeType) =>
    selectAtom<
      Promise<FlattenedExploreESResponse | null>,
      Promise<FlattenedExploreESResponse['aggs'] | undefined>
    >(
      queryResponseAtom({ experimentTypeName, brainRegionSource }),
      async (response) => response?.aggs
    ),
  isEqual
);
