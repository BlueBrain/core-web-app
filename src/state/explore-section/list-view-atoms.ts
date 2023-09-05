import { atom } from 'jotai';
import { atomWithDefault, atomFamily, selectAtom } from 'jotai/utils';
import uniq from 'lodash/uniq';
import columnKeyToFilter from './column-key-to-filter';
import { SortState } from '@/types/explore-section/application';
import fetchDataQuery from '@/queries/explore-section/data';
import { fetchRules } from '@/api/generalization';
import sessionAtom from '@/state/session';
import fetchEsResourcesByType, { fetchDimensionAggs } from '@/api/explore-section/resources';
import {
  PAGE_SIZE,
  PAGE_NUMBER,
  SIMULATION_CAMPAIGNS,
} from '@/constants/explore-section/list-views';
import { typeToColumns } from '@/state/explore-section/type-to-columns';
import { RuleOutput } from '@/types/explore-section/kg-inference';
import { FlattenedExploreESResponse, ExploreESHit } from '@/types/explore-section/es';
import { Filter } from '@/components/Filter/types';

export const pageSizeAtom = atom<number>(PAGE_SIZE);

export const pageNumberAtom = atom<number>(PAGE_NUMBER);

export const selectedRowsAtom = atomFamily(() => atom<ExploreESHit[]>([]));

export const searchStringAtom = atom<string>('');

export const sortStateAtom = atom<SortState | undefined>({ field: 'createdAt', order: 'desc' });

export const activeColumnsAtom = atomFamily((experimentTypeName: string) =>
  atomWithDefault<Promise<string[]>>(async (get) => {
    const dimensionColumns = await get(dimensionColumnsAtom(experimentTypeName));
    return ['index', ...(dimensionColumns || []), ...typeToColumns[experimentTypeName]];
  })
);

export const dimensionColumnsAtom = atomFamily((experimentTypeName: string) =>
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

export const filtersAtom = atomFamily((experimentTypeName: string) =>
  atomWithDefault<Promise<Filter[]>>(async (get) => {
    const columnsKeys = typeToColumns[experimentTypeName];
    const dimensionsColumns = await get(dimensionColumnsAtom(experimentTypeName));
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
  })
);

export const queryAtom = atomFamily((experimentTypeName: string) =>
  atom<object>(async (get) => {
    const searchString = get(searchStringAtom);
    const pageNumber = get(pageNumberAtom);
    const pageSize = get(pageSizeAtom);
    const sortState = get(sortStateAtom);
    const filters = await get(filtersAtom(experimentTypeName));

    if (!filters) {
      return null;
    }

    return fetchDataQuery(
      pageSize,
      pageNumber,
      filters,
      experimentTypeName,
      sortState,
      searchString
    );
  })
);

export const queryResponseAtom = atomFamily((experimentTypeName: string) =>
  atom<Promise<FlattenedExploreESResponse | null>>(async (get) => {
    const session = get(sessionAtom);
    const query = await get(queryAtom(experimentTypeName));

    if (!session) return null;

    return fetchEsResourcesByType(session.accessToken, query);
  })
);

export const dataAtom = atomFamily((experimentTypeName: string) =>
  selectAtom<
    Promise<FlattenedExploreESResponse | null>,
    Promise<FlattenedExploreESResponse['hits']>
  >(queryResponseAtom(experimentTypeName), async (response) => response?.hits ?? [])
);

export const totalAtom = atomFamily((experimentTypeName: string) =>
  selectAtom<Promise<FlattenedExploreESResponse | null>, Promise<number | null>>(
    queryResponseAtom(experimentTypeName),
    async (response) => {
      const { total } = response ?? {
        total: { value: 0 },
      };
      return total.value;
    }
  )
);

export const aggregationsAtom = atomFamily((experimentTypeName: string) =>
  selectAtom<
    Promise<FlattenedExploreESResponse | null>,
    Promise<FlattenedExploreESResponse['aggs'] | undefined>
  >(queryResponseAtom(experimentTypeName), async (response) => response?.aggs)
);

export const rulesResponseAtom = atomFamily((experimentTypeName: string) =>
  atom<Promise<RuleOutput[]> | null>((get) => {
    const session = get(sessionAtom);

    if (!session) return null;

    return fetchRules(session, experimentTypeName);
  })
);
