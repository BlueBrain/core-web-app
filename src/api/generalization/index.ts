import { Session } from 'next-auth';
import { createHeaders } from '@/util/utils';
import {
  InferenceError,
  RulesOutput,
  ResourceBasedInferenceRequest,
  ResourceBasedInferenceResponse,
} from '@/types/explore-section/kg-inference';
import { kgInferenceBaseUrl } from '@/config';

const RESOURCE_BASED_RULE_TERM = 'ResourceGeneralizationRule';

export function fetchRules(
  session: Session,
  resourceIds: string[],
  signal?: AbortSignal
): Promise<RulesOutput> {
  const result = fetch(`${kgInferenceBaseUrl}/rules`, {
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
  return fetch(`${kgInferenceBaseUrl}/infer`, {
    method: 'POST',
    headers: createHeaders(session.accessToken),
    body: JSON.stringify(requestBody),
    signal,
  }).then((response) => response.json());
}
