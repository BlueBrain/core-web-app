import { Key } from 'react';
import { atom } from 'jotai';
import { atomFamily, atomWithDefault } from 'jotai/utils';
import head from 'lodash/head';
import map from 'lodash/map';
import { fetchRules, fetchResourceBasedInference } from '@/api/generalization';
import sessionAtom from '@/state/session';
import {
  RulesOutput,
  ResourceBasedInferenceRequest,
  ResourceBasedInferenceResponse,
  ResourceBasedGeneralization,
  InferredResource,
} from '@/types/explore-section/kg-inference';
import { PAGE_NUMBER } from '@/constants/explore-section/list-views';
import { fetchDataQueryUsingIds } from '@/queries/explore-section/data';
import { fetchEsResourcesByType } from '@/api/explore-section/resources';
import { ExploreESHit } from '@/types/explore-section/es';

export const inferredResourcesAtom = atomFamily(() => atom(new Array<InferredResource>()));
export const expandedRowKeysAtom = atomFamily(() => atom<readonly Key[]>([]));
export const limitQueryParameterAtom = atomFamily(() => atom(20));

export const rulesResponseAtom = atomFamily((resourceId: string) =>
  atom<Promise<RulesOutput | null>>(async (get) => {
    const session = get(sessionAtom);

    if (!session) return null;

    const result = await fetchRules(session, [resourceId]);

    return result;
  })
);

type Rule = ResourceBasedGeneralization & { modelName: string; ruleId: string };

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

export const resourceBasedResponseDataAtom = atomFamily((resourceId: string) =>
  atom<Promise<ExploreESHit[] | null>>(async (get) => {
    const session = get(sessionAtom);

    if (!session) return null;

    const resourceBasedResponse = await get(resourceBasedResponseAtom(resourceId));

    if (!resourceBasedResponse || resourceBasedResponse.length === 0) return null;

    const ids = map(head(resourceBasedResponse)?.results, 'id');

    if (!ids) return null;

    const query = fetchDataQueryUsingIds(6, PAGE_NUMBER, [], ids);

    const response = query && (await fetchEsResourcesByType(session.accessToken, query));

    if (response?.hits) {
      return response.hits;
    }

    return [];
  })
);
