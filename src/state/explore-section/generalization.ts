import { atom } from 'jotai';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import filter from 'lodash/filter';
import pick from 'lodash/pick';
import { atomWithDefault, atomFamily } from 'jotai/utils';
import { fetchRules, fetchResourceBasedInference } from '@/api/generalization';
import sessionAtom from '@/state/session';
import { RELEVANT_RULES } from '@/constants/explore-section/kg-inference';
import {
  RuleOutput,
  ResourceBasedInference,
  ResourceBasedInferenceRequest,
} from '@/types/explore-section/kg-inference';

export const inferredResourceIdsAtom = atomFamily(() => atom(new Array<string>()));

export const rulesResponseAtom = atomFamily((resourceId: string) =>
  atom<Promise<RuleOutput[] | null>>(async (get) => {
    const session = get(sessionAtom);

    if (!session) return null;

    const result = await fetchRules(session, resourceId);

    return result;
  })
);

export const resourceBasedRulesAtom = atomFamily((resourceId: string) =>
  atomWithDefault<ResourceBasedInference[]>((get) => get(resourceBasedRulesInitialAtom(resourceId)))
);

export const resourceBasedRulesInitialAtom = atomFamily((resourceId: string) =>
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
  atom(async (get) => {
    const resourceBasedRules = await get(resourceBasedRulesAtom(resourceId));
    const ruleIds = new Set();
    const selectedModelsArray = new Set();

    if (resourceBasedRules.length === 0) return null;

    resourceBasedRules.forEach((rule) => {
      if (rule.value) {
        ruleIds.add(pick(rule, 'id'));
        selectedModelsArray.add(rule.name);
      }
    });

    return {
      rules: Array.from(ruleIds) as string[],
      inputFilter: {
        TargetResourceParameter: resourceId,
        SelectModelsParameter: Array.from(selectedModelsArray),
      },
    };
  })
);

export const resourceBasedResponseAtom = atomFamily((resourceId: string) =>
  atom(async (get) => {
    const request = await get(resourceBasedRequestAtom(resourceId));

    const session = get(sessionAtom);

    if ((request && isEmpty(request.rules)) || !session) return null;

    const results = await Promise.resolve(
      fetchResourceBasedInference(session, request as ResourceBasedInferenceRequest)
    );

    return results;
  })
);
