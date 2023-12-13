import { Session } from 'next-auth';
import { createHeaders } from '@/util/utils';
import {
  InferenceError,
  RulesOutput,
  ResourceBasedInferenceRequest,
  ResourceBasedInferenceResponse,
} from '@/types/explore-section/kg-inference';
import { BASE_URL } from '@/constants/explore-section/kg-inference';

const RESOURCE_BASED_RULE_TERM = 'ResourceGeneralizationRule';

export function fetchRules(
  session: Session,
  resourceIds: string[],
  signal?: AbortSignal
): Promise<RulesOutput> {
  const result = fetch(`${BASE_URL}/rules`, {
    method: 'POST',
    headers: createHeaders(session.accessToken),
    body: JSON.stringify({ resourceIds, ruleTypes: [RESOURCE_BASED_RULE_TERM] }),
    signal,
  }).then((response) => response.json());
  return result;
}

export function fetchResourceBasedInference(
  session: Session,
  requestBody: ResourceBasedInferenceRequest,
  signal?: AbortSignal
): Promise<ResourceBasedInferenceResponse | InferenceError> {
  return fetch(`${BASE_URL}/infer`, {
    method: 'POST',
    headers: createHeaders(session.accessToken),
    body: JSON.stringify(requestBody),
    signal,
  }).then((response) => response.json());
}
