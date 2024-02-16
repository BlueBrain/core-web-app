import { Key } from 'react';
import { Atom, atom } from 'jotai';
import { atomFamily, atomWithDefault } from 'jotai/utils';
import head from 'lodash/head';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import { fetchRules, fetchResourceBasedInference } from '@/api/generalization';
import sessionAtom from '@/state/session';
import { filtersAtom } from '@/state/explore-section/list-view-atoms';
import {
  RulesOutput,
  ResourceBasedInferenceRequest,
  ResourceBasedInferenceResponse,
  ResourceBasedInference,
  ResourceBasedGeneralization,
  InferredResource,
} from '@/types/explore-section/kg-inference';

import { FlattenedExploreESResponse } from '@/types/explore-section/es';
import { DataType, PAGE_NUMBER } from '@/constants/explore-section/list-views';
import { DEFAULT_CARDS_NUMBER } from '@/constants/explore-section/generalization';
import { fetchDataQueryUsingIds, fetchMorphoMetricsUsingIds } from '@/queries/explore-section/data';
import { fetchEsResourcesByType } from '@/api/explore-section/resources';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { isNeuronMorphologyFeatureAnnotation } from '@/util/explore-section/typeUnionTargetting';

export const inferredResourcesAtom = atomFamily(() => atom(new Array<InferredResource>()));
export const expandedRowKeysAtom = atomFamily(() => atom<readonly Key[]>([]));
export const limitQueryParameterAtom = atomFamily(() => atom(DEFAULT_CARDS_NUMBER));

export const rulesResponseAtom = atomFamily((resourceId: string) =>
  atom<Promise<RulesOutput | null>>(async (get, { signal }) => {
    const session = get(sessionAtom);

    if (!session) return null;

    const result = await fetchRules(session, [resourceId], signal).catch((e) => {
      if (e.name === 'AbortError') return null;
      throw new Error(e);
    });

    return result;
  })
);

type Rule = ResourceBasedGeneralization & { modelName: string; ruleId: string };

type GenFamilyType = {
  resourceId: string;
  dataType: DataType;
};

function flattenRules(formattedRules: Rule[], { rules }: RulesOutput[0]): Rule[] {
  // Un-nest the "rules".
  return rules.reduce(
    (acc, { id: ruleId, inputParameters }) =>
      // Un-nest the "models".
      inputParameters.reduce(
        (acc2, { name, values }) =>
          // Un-nest the "inputParameters".
          name === 'SelectModelsParameter' && values
            ? Object.entries(values).reduce(
                (acc3, [modelName, value]) => [
                  ...acc3,
                  {
                    ...value,
                    modelName, // For SelectModelsParameter
                    ruleId,
                  },
                ],
                acc2
              )
            : acc2,
        acc
      ),
    formattedRules
  );
}

// Reduce the rules response into a (flat) array of ResourceBasedRule objects.
export const rulesAtom = atomFamily((resourceId: string) =>
  atom<Promise<Rule[] | undefined>>(async (get) => {
    const rulesResponse = await get(rulesResponseAtom(resourceId));

    return rulesResponse?.reduce(flattenRules, []);
  })
);

export const selectedRulesAtom = atomFamily((resourceId: string) =>
  atomWithDefault<Promise<string[]> | string[]>(async (get) => {
    const rules = await get(rulesAtom(resourceId));

    const defaultSelectedRule = rules?.[0]?.modelName; // TODO: Defaults to 1st available rule. Remove this later (when performance is improved), and make this atom a non-async one.

    return defaultSelectedRule ? [defaultSelectedRule] : [];
  })
);

export const resourceBasedRequestAtom = atomFamily((resourceId: string) =>
  atom<Promise<ResourceBasedInferenceRequest | null>>(async (get) => {
    const rules = await get(rulesAtom(resourceId));

    const selectedRules = await get(selectedRulesAtom(resourceId));
    const limitQueryParameter = get(limitQueryParameterAtom(resourceId));

    function reduceRules(acc: { id: string }[], { ruleId }: Rule): { id: string }[] {
      const alreadyRepresented = acc.find(({ id }) => id === ruleId);

      return alreadyRepresented ? acc : [...acc, { id: ruleId }];
    }

    function reduceSelectedModels(acc: string[], { modelName }: Rule): string[] {
      const alreadyRepresented = acc.find((selectedModelName) => selectedModelName === modelName);

      if (alreadyRepresented) {
        return acc;
      }

      return selectedRules.length
        ? [...acc, modelName].filter((name) => selectedRules.includes(name))
        : [...acc, modelName]; // Apply all models if no boxes checked.
    }

    return rules && rules?.length > 0
      ? {
          rules: rules?.reduce(reduceRules, []),
          inputFilter: {
            TargetResourceParameter: resourceId,
            SelectModelsParameter: rules.reduce(reduceSelectedModels, []),
            LimitQueryParameter: limitQueryParameter,
            SpecifiedTargetResourceType: 'ReconstructedNeuronMorphology',
          },
        }
      : null;
  })
);

export const resourceBasedResponseAtom = atomFamily((resourceId: string) =>
  atom<Promise<ResourceBasedInferenceResponse | null>>(async (get, { signal }) => {
    const session = get(sessionAtom);

    if (!session) return null;

    const request = await get(resourceBasedRequestAtom(resourceId));

    if (request === null) return null; // No rules

    const results = await fetchResourceBasedInference(session, request, signal);

    if (!Array.isArray(results)) return null; // Error

    return results;
  })
);

export const resourceBasedResponseResultsAtom = atomFamily((resourceId: string) =>
  atom<Promise<ResourceBasedInference[] | null>>(async (get) => {
    const resourceBasedResponse = await get(resourceBasedResponseAtom(resourceId));

    if (!resourceBasedResponse || resourceBasedResponse.length === 0) return null;

    return head(resourceBasedResponse)?.results || [];
  })
);

export const resourceBasedResponseRawAtom = atomFamily<
  GenFamilyType,
  Atom<Promise<FlattenedExploreESResponse<ExploreSectionResource> | null>>
>(
  ({ resourceId, dataType }) =>
    atom(async (get, { signal }) => {
      const session = get(sessionAtom);

      if (!session) return null;

      const resourceBasedResponseResults = await get(resourceBasedResponseResultsAtom(resourceId));

      if (!resourceBasedResponseResults || resourceBasedResponseResults.length === 0) return null;

      const ids = map(resourceBasedResponseResults, 'id');

      if (!ids) return null;

      const filters = await get(filtersAtom({ dataType, resourceId }));

      const query = fetchDataQueryUsingIds(DEFAULT_CARDS_NUMBER, PAGE_NUMBER, filters, ids);

      const esResponse =
        query && (await fetchEsResourcesByType(session.accessToken, query, signal));

      if (!esResponse) return null; // Error

      // Use sortBy to order the results based on the order of IDs in resourceBasedResponseResults
      esResponse.hits =
        esResponse && esResponse.hits
          ? sortBy(esResponse.hits, (item) => ids.indexOf(item._id))
          : [];

      return esResponse;
    }),
  isEqual
);

export const resourceBasedResponseHitsAtom = atomFamily<
  GenFamilyType,
  Atom<Promise<FlattenedExploreESResponse<ExploreSectionResource>['hits'] | undefined>>
>(
  ({ resourceId, dataType }) =>
    atom(async (get) => {
      const response = await get(resourceBasedResponseRawAtom({ resourceId, dataType }));
      return response?.hits;
    }),
  isEqual
);

export const resourceBasedResponseAggregationsAtom = atomFamily(
  ({ resourceId, dataType }: GenFamilyType) =>
    atom<Promise<FlattenedExploreESResponse<ExploreSectionResource>['aggs'] | undefined>>(
      async (get) => {
        const response = await get(resourceBasedResponseRawAtom({ resourceId, dataType }));
        return response?.aggs;
      }
    ),
  isEqual
);

export const resourceBasedResponseHitsCountAtom = atomFamily(
  ({ resourceId, dataType }: GenFamilyType) =>
    atom<Promise<number | undefined>>(async (get) => {
      const response = await get(resourceBasedResponseRawAtom({ resourceId, dataType }));
      return response?.hits?.length;
    }),
  isEqual
);

export const resourceBasedResponseMorphoMetricsAtom = atomFamily<
  GenFamilyType,
  Atom<Promise<FlattenedExploreESResponse<ExploreSectionResource> | null>>
>(
  ({ resourceId, dataType }) =>
    atom(async (get) => {
      const session = get(sessionAtom);

      if (!session) return null;

      const resourceBasedResponseHits = await get(
        resourceBasedResponseHitsAtom({ resourceId, dataType })
      );

      if (!resourceBasedResponseHits || resourceBasedResponseHits.length === 0) return null;

      const ids = map(resourceBasedResponseHits, '_id');

      if (!ids) return null;

      const filters = await get(filtersAtom({ dataType, resourceId }));

      const query = fetchMorphoMetricsUsingIds(DEFAULT_CARDS_NUMBER * 5, PAGE_NUMBER, filters, ids);

      const esResponse = query && (await fetchEsResourcesByType(session.accessToken, query));

      if (!esResponse) return null; // Error

      // Use sortBy to order the results based on the order of IDs in resourceBasedResponseResults
      esResponse.hits =
        esResponse && esResponse.hits
          ? sortBy(esResponse.hits, (item) =>
              isNeuronMorphologyFeatureAnnotation(item._source)
                ? ids.indexOf(item._source.neuronMorphology['@id'])
                : -1
            )
          : [];

      return esResponse;
    }),
  isEqual
);

export const sourceMorphoMetricsAtom = atomFamily(
  (resourceId: string) =>
    atom<Promise<FlattenedExploreESResponse<ExploreSectionResource>['hits'] | null>>(
      async (get) => {
        const session = get(sessionAtom);

        if (!session) return null;

        const query = fetchMorphoMetricsUsingIds(5, PAGE_NUMBER, [], [resourceId]);

        const esResponse = query && (await fetchEsResourcesByType(session.accessToken, query));

        return esResponse.hits || null;
      }
    ),
  isEqual
);
