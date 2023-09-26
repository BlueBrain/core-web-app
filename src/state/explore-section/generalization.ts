import { atom } from 'jotai';
import { selectAtom, atomWithDefault, atomFamily } from 'jotai/utils';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import filter from 'lodash/filter';
import { fetchRules, fetchResourceBasedInference } from '@/api/generalization';
import sessionAtom from '@/state/session';
import { RELEVANT_RULES } from '@/constants/explore-section/kg-inference';
import {
  RuleOutput,
  ResourceBasedInference,
  ResourceBasedInferenceRequest,
  ResourceBasedInferenceResponse,
  InferredResource,
} from '@/types/explore-section/kg-inference';

export const inferredResourcesAtom = atomFamily(() => atom(new Array<InferredResource>()));

export const rulesResponseAtom = atomFamily((resourceId: string) =>
  atom<Promise<RuleOutput[] | null>>(async (get) => {
    const session = get(sessionAtom);

    if (!session) return null;

    const result = await fetchRules(session, resourceId);

    return result;
  })
);

export const resourceBasedRulesAtom = atomFamily((resourceId: string) =>
  atomWithDefault<any>(async (get) => {
    const rulesResponse = await get(rulesResponseAtom(resourceId));

    const rulesWithBool: ResourceBasedInference[] = [];

    // Create a Set of keys from RELEVANT_RULES for efficient membership checks
    const relevantRuleKeys = new Set(Object.keys(RELEVANT_RULES));

    // Filter rules based on the specified names
    const relevantRules = filter(rulesResponse, (rule) => relevantRuleKeys.has(rule.id));

    // Generate initial state for the relevant rules
    relevantRules.forEach((rule: RuleOutput) => {
      const inferenceOptions = find(rule.inputParameters, {
        name: 'SelectModelsParameter',
      })?.values;
      if (typeof inferenceOptions !== 'undefined')
        inferenceOptions.forEach((inferenceOption: string) => {
          rulesWithBool.push({ name: inferenceOption, value: false, id: rule.id });
        });
    });

    return rulesWithBool;
  })
);

export const resourceBasedRequestAtom = atomFamily((resourceId: string) =>
  selectAtom<ResourceBasedInference[], ResourceBasedInferenceRequest>(
    resourceBasedRulesAtom(resourceId),
    (resourceBasedRules) => {
      const uniqueRuleIds = [...new Set(resourceBasedRules?.map(({ id }) => id))];
      const uniqueSelectedModels = [...new Set(resourceBasedRules?.map(({ name }) => name))];

      return {
        rules: uniqueRuleIds.map((id) => ({
          id,
        })),
        inputFilter: {
          TargetResourceParameter: resourceId,
          SelectModelsParameter: uniqueSelectedModels,
        },
      };
    }
  )
);

export const resourceBasedResponseAtom = atomFamily((resourceId: string) =>
  atom<Promise<ResourceBasedInferenceResponse | null>>(async (get) => {
    const session = get(sessionAtom);

    if (!session) return null;

    const request = await get(resourceBasedRequestAtom(resourceId)); // TODO: Why 'await' has no effect on the type of this expression?

    if (isEmpty(request.rules)) return null; // No rules

    const results = await fetchResourceBasedInference(session, request);

    if (!Array.isArray(results)) return null; // Error

    return results;
  })
);
