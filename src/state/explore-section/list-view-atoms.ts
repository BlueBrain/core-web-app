import { Atom, atom } from 'jotai';
import { atomFamily, atomWithDefault } from 'jotai/utils';
import uniq from 'lodash/uniq';
import columnKeyToFilter from './column-key-to-filter';
import { ExploreDataBrainRegionSource, SortState } from '@/types/explore-section/application';
import fetchDataQuery from '@/queries/explore-section/data';
import {
  DataQuery,
  fetchDimensionAggs,
  fetchEsResourcesByType,
  fetchTotalByExperimentAndRegions,
} from '@/api/explore-section/resources';
import sessionAtom from '@/state/session';
import { DataType, PAGE_NUMBER, PAGE_SIZE } from '@/constants/explore-section/list-views';
import { ExploreESHit, FlattenedExploreESResponse } from '@/types/explore-section/es';
import { Filter } from '@/components/Filter/types';
import { selectedBrainRegionWithChildrenAtom } from '@/state/brain-regions';
import { FilterTypeEnum } from '@/types/explore-section/filters';
import { DATA_TYPES_TO_CONFIGS } from '@/constants/explore-section/data-types';
import { ExploreSectionResource } from '@/types/explore-section/resources';

type DataAtomFamilyScopeType = {
  dataType: DataType;
  brainRegionSource?: ExploreDataBrainRegionSource;
  resourceId?: string;
};

const isListAtomEqual = (a: DataAtomFamilyScopeType, b: DataAtomFamilyScopeType): boolean =>
  // eslint-disable-next-line lodash/prefer-matches
  a.dataType === b.dataType &&
  a.brainRegionSource === b.brainRegionSource &&
  a.resourceId === b.resourceId;

export const pageSizeAtom = atom<number>(PAGE_SIZE);

export const pageNumberAtom = atomFamily(() => atom<number>(PAGE_NUMBER), isListAtomEqual);

export const selectedRowsAtom = atomFamily(
  () => atom<ExploreESHit<ExploreSectionResource>[]>([]),
  isListAtomEqual
);

export const searchStringAtom = atomFamily(() => atom<string>(''), isListAtomEqual);

export const sortStateAtom = atom<SortState | undefined>({ field: 'createdAt', order: 'desc' });

export const activeColumnsAtom = atomFamily(
  ({ dataType }: DataAtomFamilyScopeType) =>
    atomWithDefault<Promise<string[]> | string[]>(async (get) => {
      const dimensionColumns = await get(dimensionColumnsAtom({ dataType }));
      const { columns } = DATA_TYPES_TO_CONFIGS[dataType];

      return ['index', ...(dimensionColumns || []), ...columns];
    }),
  isListAtomEqual
);

export const dimensionColumnsAtom = atomFamily(({ dataType }: DataAtomFamilyScopeType) =>
  atom<Promise<string[] | null>>(async (get) => {
    const session = get(sessionAtom);

    // if the type is not simulation campaign, we dont fetch dimension columns
    if (!session || dataType !== DataType.SimulationCampaigns) {
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
  ({ dataType }: DataAtomFamilyScopeType) =>
    atomWithDefault<Promise<Filter[]>>(async (get) => {
      const { columns } = DATA_TYPES_TO_CONFIGS[dataType];
      const dimensionsColumns = await get(dimensionColumnsAtom({ dataType }));
      return [
        ...columns.map((colKey) => columnKeyToFilter(colKey)),
        ...(dimensionsColumns || []).map(
          (dimension) =>
            ({
              field: dimension,
              type: FilterTypeEnum.ValueOrRange,
              value: { gte: null, lte: null },
              aggregationType: 'stats',
            }) as Filter
        ),
      ];
    }),
  isListAtomEqual
);

export const totalByExperimentAndRegionsAtom = atomFamily(
  ({ dataType, brainRegionSource }: DataAtomFamilyScopeType) =>
    atom<Promise<number | undefined | null>>(async (get) => {
      const session = get(sessionAtom);

      if (!session) return null;

      const sortState = get(sortStateAtom);
      let descendantIds: string[] = [];

      if (brainRegionSource === 'selected')
        descendantIds = (await get(selectedBrainRegionWithChildrenAtom)) || [];

      const query = fetchDataQuery(0, 1, [], dataType, sortState, '', descendantIds);

      const result = query && (await fetchTotalByExperimentAndRegions(session.accessToken, query));

      return result;
    }),
  isListAtomEqual
);

export const queryAtom = atomFamily(
  ({ dataType, brainRegionSource }: DataAtomFamilyScopeType) =>
    atom<Promise<DataQuery | null>>(async (get) => {
      const searchString = get(searchStringAtom({ dataType }));
      const pageNumber = get(pageNumberAtom({ dataType }));
      const pageSize = get(pageSizeAtom);
      const sortState = get(sortStateAtom);

      const descendantIds: string[] =
        brainRegionSource === 'selected'
          ? (await get(selectedBrainRegionWithChildrenAtom)) || []
          : [];

      const filters = await get(filtersAtom({ dataType }));

      if (!filters) {
        return null;
      }

      return fetchDataQuery(
        pageSize,
        pageNumber,
        filters,
        dataType,
        sortState,
        searchString,
        descendantIds
      );
    }),
  isListAtomEqual
);

export const queryResponseAtom = atomFamily(
  ({ dataType, brainRegionSource }: DataAtomFamilyScopeType) =>
    atom<Promise<FlattenedExploreESResponse<ExploreSectionResource> | null>>(async (get) => {
      const session = get(sessionAtom);

      if (!session) return null;

      const query = await get(queryAtom({ dataType, brainRegionSource }));
      const result = query && (await fetchEsResourcesByType(session.accessToken, query));

      return result;
    }),
  isListAtomEqual
);

export const dataAtom = atomFamily<
  DataAtomFamilyScopeType,
  Atom<Promise<ExploreESHit<ExploreSectionResource>[]>>
>(
  ({ dataType, brainRegionSource }) =>
    atom(async (get) => {
      const response = await get(queryResponseAtom({ dataType, brainRegionSource }));

      if (response?.hits) {
        return response.hits;
      }

      return [];
    }),
  isListAtomEqual
);

export const totalAtom = atomFamily(
  ({ dataType, brainRegionSource }: DataAtomFamilyScopeType) =>
    atom(async (get) => {
      const response = await get(queryResponseAtom({ dataType, brainRegionSource }));
      const { total } = response ?? {
        total: { value: 0 },
      };
      return total?.value;
    }),
  isListAtomEqual
);

export const aggregationsAtom = atomFamily(
  ({ dataType, brainRegionSource }: DataAtomFamilyScopeType) =>
    atom<Promise<FlattenedExploreESResponse<ExploreSectionResource>['aggs'] | undefined>>(
      async (get) => {
        const response = await get(queryResponseAtom({ dataType, brainRegionSource }));
        return response?.aggs;
      }
    ),
  isListAtomEqual
);
