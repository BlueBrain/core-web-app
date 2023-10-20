import { atom } from 'jotai';
import { atomWithDefault, atomFamily, selectAtom } from 'jotai/utils';
import uniq from 'lodash/uniq';
import columnKeyToFilter from './column-key-to-filter';
import { SortState } from '@/types/explore-section/application';
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
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { getBrainRegionDescendants } from '@/state/brain-regions/descendants';

type DataAtomFamilyScopeType = { experimentTypeName: string };

const DataAtomFamilyScopeComparator = (a: DataAtomFamilyScopeType, b: DataAtomFamilyScopeType) =>
  a.experimentTypeName === b.experimentTypeName;

export const pageSizeAtom = atom<number>(PAGE_SIZE);

export const pageNumberAtom = atomFamily(
  () => atom<number>(PAGE_NUMBER),
  DataAtomFamilyScopeComparator
);

export const selectedRowsAtom = atomFamily(
  () => atom<ExploreESHit[]>([]),
  DataAtomFamilyScopeComparator
);

export const searchStringAtom = atomFamily(() => atom<string>(''), DataAtomFamilyScopeComparator);

export const sortStateAtom = atom<SortState | undefined>({ field: 'createdAt', order: 'desc' });

export const activeColumnsAtom = atomFamily(
  ({ experimentTypeName }: DataAtomFamilyScopeType) =>
    atomWithDefault<Promise<string[]>>(async (get) => {
      const dimensionColumns = await get(dimensionColumnsAtom({ experimentTypeName }));
      return ['index', ...(dimensionColumns || []), ...typeToColumns[experimentTypeName]];
    }),
  DataAtomFamilyScopeComparator
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
  DataAtomFamilyScopeComparator
);

export const queryAtom = atomFamily(
  ({ experimentTypeName }: DataAtomFamilyScopeType) =>
    atom<Promise<DataQuery | null>>(async (get) => {
      const searchString = get(searchStringAtom({ experimentTypeName }));
      const pageNumber = get(pageNumberAtom({ experimentTypeName }));
      const pageSize = get(pageSizeAtom);
      const sortState = get(sortStateAtom);
      const selectedBrainRegion = get(selectedBrainRegionAtom);
      // if a brain region is not selected, selecting by default the brain region with id 8 (Basic cell groups and regions)
      const descendants = await get(
        getBrainRegionDescendants(selectedBrainRegion?.id ? [selectedBrainRegion.id] : ['8'])
      );
      const descendantIds = descendants?.map(
        (d) => `http://api.brain-map.org/api/v2/data/Structure/${d.id}`
      );
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
  DataAtomFamilyScopeComparator
);

export const queryResponseAtom = atomFamily(
  ({ experimentTypeName }: DataAtomFamilyScopeType) =>
    atom<Promise<FlattenedExploreESResponse | null>>(async (get) => {
      const session = get(sessionAtom);

      if (!session) return null;

      const query = await get(queryAtom({ experimentTypeName }));
      const result = query && (await fetchEsResourcesByType(session.accessToken, query));

      return result;
    }),
  DataAtomFamilyScopeComparator
);

export const dataAtom = atomFamily(
  ({ experimentTypeName }: DataAtomFamilyScopeType) =>
    atom(async (get) => {
      const response = await get(queryResponseAtom({ experimentTypeName }));
      if (response?.hits) {
        return response.hits;
      }
      return [];
    }),
  DataAtomFamilyScopeComparator
);

export const totalAtom = atomFamily(
  ({ experimentTypeName }: DataAtomFamilyScopeType) =>
    atom(async (get) => {
      const response = await get(queryResponseAtom({ experimentTypeName }));
      const { total } = response ?? {
        total: { value: 0 },
      };
      return total?.value;
    }),
  DataAtomFamilyScopeComparator
);

export const aggregationsAtom = atomFamily(
  ({ experimentTypeName }: DataAtomFamilyScopeType) =>
    selectAtom<
      Promise<FlattenedExploreESResponse | null>,
      Promise<FlattenedExploreESResponse['aggs'] | undefined>
    >(queryResponseAtom({ experimentTypeName }), async (response) => response?.aggs),
  DataAtomFamilyScopeComparator
);
