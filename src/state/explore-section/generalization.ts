import { Key } from 'react';
import { atom } from 'jotai';
import { atomFamily, atomWithDefault, selectAtom } from 'jotai/utils';
import head from 'lodash/head';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import { fetchRules, fetchResourceBasedInference } from '@/api/generalization';
import sessionAtom from '@/state/session';
import { filtersAtom } from '@/state/explore-section/list-view-atoms';
import {
  RulesOutput,
  ResourceBasedInferenceRequest,
  ResourceBasedInferenceResponse,
  ResourceBasedInferenceSingleResponse,
  ResourceBasedGeneralization,
  InferredResource,
} from '@/types/explore-section/kg-inference';

import { CardMetric, CardMetricIds } from '@/types/explore-section/generalization';

import { FlattenedExploreESResponse } from '@/types/explore-section/es';
import { PAGE_NUMBER } from '@/constants/explore-section/list-views';
import {
  DEFAULT_CARD_METRIC,
  DEFAULT_CARDS_NUMBER,
} from '@/constants/explore-section/generalization';
import { fetchDataQueryUsingIds } from '@/queries/explore-section/data';
import { fetchEsResourcesByType } from '@/api/explore-section/resources';

const CARD_METRICS: CardMetric[] = [
  {
    id: 'metadata',
    name: 'Metadata',
    description:
      'Name, brain region, m-type, condition, specie, contributor, creation date, reference',
  },
  {
    id: 'morphometrics',
    name: 'Morphometrics',
    description: 'Axon total length, dendrite total length, dendrite maximal length',
  },
];

export const inferredResourcesAtom = atomFamily(() => atom(new Array<InferredResource>()));
export const expandedRowKeysAtom = atomFamily(() => atom<readonly Key[]>([]));
export const limitQueryParameterAtom = atomFamily(() => atom(DEFAULT_CARDS_NUMBER));

export const rulesResponseAtom = atomFamily((resourceId: string) =>
  atom<Promise<RulesOutput | null>>(async (get) => {
    const session = get(sessionAtom);

    if (!session) return null;

    const result = await fetchRules(session, [resourceId]);

    return result;
  })
);

type Rule = ResourceBasedGeneralization & { modelName: string; ruleId: string };

type ResourceBasedResponseAtomFamilyScopeType = {
  resourceId: string;
  experimentTypeName: string;
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

export const cardsMetricsAtom = atom<readonly CardMetric[]>(CARD_METRICS);

export const selectedCardsMetricAtom = atom<CardMetricIds>(DEFAULT_CARD_METRIC);

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

    return rules
      ? {
          rules: rules?.reduce(reduceRules, []) ?? [],
          inputFilter: {
            TargetResourceParameter: resourceId,
            SelectModelsParameter: rules.reduce(reduceSelectedModels, []),
            LimitQueryParameter: limitQueryParameter,
          },
        }
      : null;
  })
);

export const resourceBasedResponseAtom = atomFamily((resourceId: string) =>
  atom<Promise<ResourceBasedInferenceResponse | null>>(async (get) => {
    const session = get(sessionAtom);

    if (!session) return null;

    const request = await get(resourceBasedRequestAtom(resourceId));

    if (request === null) return null; // No rules

    const results = await fetchResourceBasedInference(session, request);

    if (!Array.isArray(results)) return null; // Error

    return results;
  })
);

export const resourceBasedResponseResultsAtom = atomFamily(
  (resourceId: string) =>
    selectAtom<
      Promise<ResourceBasedInferenceResponse | null>,
      Promise<ResourceBasedInferenceSingleResponse['results'] | null>
    >(resourceBasedResponseAtom(resourceId), async (resourceBasedResponse) => {
      if (!resourceBasedResponse || resourceBasedResponse.length === 0) return null;

      return head(resourceBasedResponse)?.results || [];
    }),
  isEqual
);

export const resourceBasedResponseRawAtom = atomFamily(
  ({ resourceId, experimentTypeName }: ResourceBasedResponseAtomFamilyScopeType) =>
    atom<Promise<FlattenedExploreESResponse | null>>(async (get) => {
      const session = get(sessionAtom);

      if (!session) return null;

      const resourceBasedResponseResults = await get(resourceBasedResponseResultsAtom(resourceId));

      if (!resourceBasedResponseResults || resourceBasedResponseResults.length === 0) return null;

      const ids = map(resourceBasedResponseResults, 'id');

      if (!ids) return null;

      const filters = await get(filtersAtom({ experimentTypeName, resourceId }));

      const query = fetchDataQueryUsingIds(DEFAULT_CARDS_NUMBER, PAGE_NUMBER, filters, ids);

      const esResponse = query && (await fetchEsResourcesByType(session.accessToken, query));

      // Use sortBy to order the results based on the order of IDs in resourceBasedResponseResults
      esResponse.hits =
        esResponse && esResponse.hits
          ? sortBy(esResponse.hits, (item) => ids.indexOf(item._id))
          : [];

      return esResponse;
    }),
  isEqual
);

export const resourceBasedResponseHitsAtom = atomFamily(
  ({ resourceId, experimentTypeName }: ResourceBasedResponseAtomFamilyScopeType) =>
    selectAtom<
      Promise<FlattenedExploreESResponse | null>,
      Promise<FlattenedExploreESResponse['hits'] | undefined>
    >(
      resourceBasedResponseRawAtom({ resourceId, experimentTypeName }),
      async (response) => response?.hits
    ),
  isEqual
);

export const resourceBasedResponseAggregationsAtom = atomFamily(
  ({ resourceId, experimentTypeName }: ResourceBasedResponseAtomFamilyScopeType) =>
    selectAtom<
      Promise<FlattenedExploreESResponse | null>,
      Promise<FlattenedExploreESResponse['aggs'] | undefined>
    >(
      resourceBasedResponseRawAtom({ resourceId, experimentTypeName }),
      async (response) => response?.aggs
    ),
  isEqual
);

export const resourceBasedResponseHitsCountAtom = atomFamily(
  ({ resourceId, experimentTypeName }: ResourceBasedResponseAtomFamilyScopeType) =>
    selectAtom<Promise<FlattenedExploreESResponse | null>, Promise<number | undefined>>(
      resourceBasedResponseRawAtom({ resourceId, experimentTypeName }),
      async (response) => response?.hits?.length
    ),
  isEqual
);
