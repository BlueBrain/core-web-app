import { Atom, atom } from 'jotai';
import { atomFamily, atomWithDefault, atomWithRefresh } from 'jotai/utils';
import uniq from 'lodash/uniq';
import isEqual from 'lodash/isEqual';
import getPath from 'lodash/get';

import { bookmarksForProjectAtomFamily } from '../virtual-lab/bookmark';
import columnKeyToFilter from './column-key-to-filter';

import { VirtualLabInfo } from '@/types/virtual-lab/common';
import { ExploreDataScope, SortState } from '@/types/explore-section/application';
import fetchDataQuery from '@/queries/explore-section/data';
import {
  DataQuery,
  fetchDimensionAggs,
  fetchEsResourcesByType,
  fetchTotalByExperimentAndRegions,
} from '@/api/explore-section/resources';
import { DataType, PAGE_NUMBER, PAGE_SIZE } from '@/constants/explore-section/list-views';
import {
  ExploreESHit,
  ExploreResource,
  FlattenedExploreESResponse,
} from '@/types/explore-section/es';
import { Filter } from '@/components/Filter/types';
import { selectedBrainRegionWithDescendantsAndAncestorsAtom } from '@/state/brain-regions';
import { FilterTypeEnum } from '@/types/explore-section/filters';
import { DATA_TYPES_TO_CONFIGS } from '@/constants/explore-section/data-types';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { fetchResourceById } from '@/api/nexus';
import { MEModelResource } from '@/types/me-model';
import { getSession } from '@/authFetch';
import { nexus } from '@/config';
import { getOrgAndProjectFromProjectId } from '@/util/nexus';

type DataAtomFamilyScopeType = {
  dataType: DataType;
  dataScope?: ExploreDataScope;
  resourceId?: string;
  virtualLabInfo?: VirtualLabInfo;
};

const isListAtomEqual = (a: DataAtomFamilyScopeType, b: DataAtomFamilyScopeType): boolean =>
  // eslint-disable-next-line lodash/prefer-matches
  a.dataType === b.dataType &&
  a.dataScope === b.dataScope &&
  a.resourceId === b.resourceId &&
  isEqual(a.virtualLabInfo, b.virtualLabInfo);

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

export const dimensionColumnsAtom = atomFamily(
  ({ dataType, virtualLabInfo }: DataAtomFamilyScopeType) =>
    atom<Promise<string[] | null>>(async () => {
      // if the type is not simulation campaign, we dont fetch dimension columns
      if (dataType !== DataType.SimulationCampaigns) {
        return null;
      }
      const dimensionsResponse = await fetchDimensionAggs(virtualLabInfo);
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
  ({ dataType, dataScope, virtualLabInfo }: DataAtomFamilyScopeType) =>
    atom<Promise<number | undefined | null>>(async (get) => {
      const sortState = get(sortStateAtom);
      let descendantAndAncestorIds: string[] = [];

      if (dataScope === ExploreDataScope.SelectedBrainRegion)
        descendantAndAncestorIds =
          (await get(selectedBrainRegionWithDescendantsAndAncestorsAtom)) || [];

      const query = fetchDataQuery(0, 1, [], dataType, sortState, '', descendantAndAncestorIds);
      const result =
        query && (await fetchTotalByExperimentAndRegions(query, undefined, virtualLabInfo));

      return result;
    }),
  isListAtomEqual
);

export const queryAtom = atomFamily(
  ({ dataType, dataScope, virtualLabInfo }: DataAtomFamilyScopeType) =>
    atomWithRefresh<Promise<DataQuery | null>>(async (get) => {
      const searchString = get(searchStringAtom({ dataType }));
      const pageNumber = get(pageNumberAtom({ dataType }));
      const pageSize = get(pageSizeAtom);
      const sortState = get(sortStateAtom);
      const bookmarkResourceIds = (
        dataScope === ExploreDataScope.BookmarkedResources && virtualLabInfo
          ? (await get(bookmarksForProjectAtomFamily(virtualLabInfo)))[dataType]
          : []
      ).map((b) => b.resourceId);

      const descendantIds: string[] =
        dataScope === ExploreDataScope.SelectedBrainRegion
          ? (await get(selectedBrainRegionWithDescendantsAndAncestorsAtom)) || []
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
        descendantIds,
        bookmarkResourceIds
      );
    }),
  isListAtomEqual
);

export const queryResponseAtom = atomFamily(
  ({ dataType, dataScope, virtualLabInfo }: DataAtomFamilyScopeType) =>
    atom<Promise<FlattenedExploreESResponse<ExploreSectionResource> | null>>(async (get) => {
      const query = await get(queryAtom({ dataType, dataScope, virtualLabInfo }));
      const result = query && (await fetchEsResourcesByType(query, undefined, virtualLabInfo));

      return result;
    }),
  isListAtomEqual
);

export const dataAtom = atomFamily<
  DataAtomFamilyScopeType,
  Atom<Promise<ExploreESHit<ExploreSectionResource>[]>>
>(
  ({ dataType, dataScope, virtualLabInfo }) =>
    atom(async (get) => {
      const response = await get(queryResponseAtom({ dataType, dataScope, virtualLabInfo }));

      if (response?.hits) {
        if (dataType === DataType.SingleNeuronSynaptome) {
          return await fetchLinkedModel({
            results: response.hits,
            path: '_source.singleNeuronSynaptome.memodel.["@id"]',
            linkedProperty: 'linkedMeModel',
          });
        }
        if (dataType === DataType.SingleNeuronSynaptomeSimulation) {
          return await fetchLinkedModel({
            results: response.hits,
            path: '_source.synaptomeSimulation.synaptome.["@id"]',
            linkedProperty: 'linkedSynaptomeModel',
          });
        }
        return response.hits;
      }
      return [];
    }),
  isListAtomEqual
);

export const totalAtom = atomFamily(
  ({ dataType, dataScope, virtualLabInfo }: DataAtomFamilyScopeType) =>
    atom(async (get) => {
      const response = await get(queryResponseAtom({ dataType, dataScope, virtualLabInfo }));
      const { total } = response ?? {
        total: { value: 0 },
      };
      return total?.value;
    }),
  isListAtomEqual
);

export const aggregationsAtom = atomFamily(
  ({ dataType, dataScope, virtualLabInfo }: DataAtomFamilyScopeType) =>
    atom<Promise<FlattenedExploreESResponse<ExploreSectionResource>['aggs'] | undefined>>(
      async (get) => {
        const response = await get(queryResponseAtom({ dataType, dataScope, virtualLabInfo }));
        return response?.aggs;
      }
    ),
  isListAtomEqual
);

async function fetchLinkedModel({
  results,
  path,
  linkedProperty,
}: {
  path: string;
  linkedProperty: string;
  results: ExploreESHit<ExploreResource>[];
}) {
  const session = await getSession();
  if (session) {
    const cache = new Map();
    const finalResult = [];
    for (const model of results) {
      const meModelId: string | null = getPath(model, path);
      if (meModelId) {
        if (cache.has(meModelId)) {
          finalResult.push({
            ...model,
            _source: {
              ...model._source,
              [linkedProperty]: cache.get(meModelId),
            },
          });
        } else {
          const { org, project } = getOrgAndProjectFromProjectId(model._source.project['@id']);
          const linkedModel = await fetchResourceById<MEModelResource>(meModelId, session, {
            ...(meModelId.startsWith(nexus.defaultIdBaseUrl)
              ? {}
              : {
                  org,
                  project,
                }),
          });
          cache.set(meModelId, linkedModel);
          finalResult.push({
            ...model,
            _source: {
              ...model._source,
              [linkedProperty]: linkedModel,
            },
          });
        }
      } else {
        finalResult.push(model);
      }
    }

    cache.clear();
    return finalResult;
  }
  return results;
}
