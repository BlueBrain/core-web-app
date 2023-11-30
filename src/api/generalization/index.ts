import { Session } from 'next-auth';
import { createHeaders } from '@/util/utils';
import {
  InferenceError,
  RulesOutput,
  ResourceBasedInferenceRequest,
  ResourceBasedInferenceResponse,
} from '@/types/explore-section/kg-inference';

const BASE_URL = 'https://kg-inference-api.kcp.bbp.epfl.ch';
const RESOURCE_BASED_RULE_TERM = 'ResourceGeneralizationRule';

export function fetchRules(session: Session, resourceIds: string[]): Promise<RulesOutput> {
  const result = fetch(`${BASE_URL}/rules`, {
    method: 'POST',
    headers: createHeaders(session.accessToken),
    body: JSON.stringify({ resourceIds, ruleTypes: [RESOURCE_BASED_RULE_TERM] }),
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
