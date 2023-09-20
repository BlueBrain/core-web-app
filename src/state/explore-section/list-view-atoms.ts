import { atom } from 'jotai';
import { atomWithDefault, atomFamily, selectAtom } from 'jotai/utils';
import uniq from 'lodash/uniq';
import head from 'lodash/head';
import columnKeyToFilter from './column-key-to-filter';
import { SortState } from '@/types/explore-section/application';
import fetchDataQuery, { fetchDataQueryUsingIds } from '@/queries/explore-section/data';
import sessionAtom from '@/state/session';
import { fetchEsResourcesByType, fetchDimensionAggs } from '@/api/explore-section/resources';
import {
  PAGE_SIZE,
  PAGE_NUMBER,
  SIMULATION_CAMPAIGNS,
} from '@/constants/explore-section/list-views';
import { typeToColumns } from '@/state/explore-section/type-to-columns';
import { ResourceBasedInference } from '@/types/explore-section/kg-inference';
import { FlattenedExploreESResponse, ExploreESHit } from '@/types/explore-section/es';
import { Filter } from '@/components/Filter/types';
import { resourceBasedResponseAtom } from '@/state/explore-section/generalization';

type DataAtomFamilyScopeType = { experimentTypeName: string; resourceId?: string };

const DataAtomFamilyScopeComparator = (a: DataAtomFamilyScopeType, b: DataAtomFamilyScopeType) =>
  a.experimentTypeName === b.experimentTypeName && a.resourceId === b.resourceId;

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
  ({ experimentTypeName, resourceId }: DataAtomFamilyScopeType) =>
    atom<object>(async (get) => {
      const searchString = get(searchStringAtom({ experimentTypeName, resourceId }));
      const pageNumber = get(pageNumberAtom({ experimentTypeName, resourceId }));
      const pageSize = get(pageSizeAtom);
      const sortState = get(sortStateAtom);
      const filters = await get(filtersAtom({ experimentTypeName, resourceId }));

      if (!filters) {
        return null;
      }

      if (resourceId) {
        const resourceBasedResponse = await get(resourceBasedResponseAtom(resourceId));
        const resultsResourceBasedResponse:
          | { id: string; results: ResourceBasedInference[] }
          | undefined = head(resourceBasedResponse);
        if (resultsResourceBasedResponse) {
          const inferredResponseIds = resultsResourceBasedResponse.results.map((v: any) => v.id);
          if (inferredResponseIds.length > 0) {
            return fetchDataQueryUsingIds(
              pageSize,
              pageNumber,
              filters,
              experimentTypeName,
              inferredResponseIds,
              sortState,
              searchString
            );
          }
        }
      }

      return fetchDataQuery(
        pageSize,
        pageNumber,
        filters,
        experimentTypeName,
        sortState,
        searchString
      );
    }),
  DataAtomFamilyScopeComparator
);

export const queryResponseAtom = atomFamily(
  ({ experimentTypeName, resourceId }: DataAtomFamilyScopeType) =>
    atom<Promise<FlattenedExploreESResponse | null>>(async (get) => {
      const session = get(sessionAtom);
      const query = await get(queryAtom({ experimentTypeName, resourceId }));

      if (!session) return null;

      const result = await fetchEsResourcesByType(session.accessToken, query);

      return result;
    }),
  DataAtomFamilyScopeComparator
);

export const dataAtom = atomFamily(
  ({ experimentTypeName, resourceId }: DataAtomFamilyScopeType) =>
    selectAtom<
      Promise<FlattenedExploreESResponse | null>,
      Promise<FlattenedExploreESResponse['hits']>
    >(
      queryResponseAtom({ experimentTypeName, resourceId }),
      async (response) => response?.hits ?? []
    ),
  DataAtomFamilyScopeComparator
);

export const totalAtom = atomFamily(
  ({ experimentTypeName, resourceId }: DataAtomFamilyScopeType) =>
    selectAtom<Promise<FlattenedExploreESResponse | null>, Promise<number | null>>(
      queryResponseAtom({ experimentTypeName, resourceId }),
      async (response) => {
        const { total } = response ?? {
          total: { value: 0 },
        };
        return total.value;
      }
    ),
  DataAtomFamilyScopeComparator
);

export const aggregationsAtom = atomFamily(
  ({ experimentTypeName, resourceId }: DataAtomFamilyScopeType) =>
    selectAtom<
      Promise<FlattenedExploreESResponse | null>,
      Promise<FlattenedExploreESResponse['aggs'] | undefined>
    >(queryResponseAtom({ experimentTypeName, resourceId }), async (response) => response?.aggs),
  DataAtomFamilyScopeComparator
);
