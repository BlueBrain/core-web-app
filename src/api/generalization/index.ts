import { Session } from 'next-auth';
import { createHeaders } from '@/util/utils';
import {
  InferenceError,
  RuleOutput,
  ResourceBasedInferenceRequest,
  ResourceBasedInferenceResponse,
} from '@/types/explore-section/kg-inference';

const BASE_URL = 'https://kg-inference-api.kcp.bbp.epfl.ch';
const RESOURCE_BASED_RULE_TERM = 'ResourceGeneralizationRule';

export function fetchRules(session: Session, resourceId: string): Promise<RuleOutput[]> {
  const result = fetch(`${BASE_URL}/rules`, {
    method: 'POST',
    headers: createHeaders(session.accessToken),
    body: JSON.stringify({ resourceId, ruleTypes: [RESOURCE_BASED_RULE_TERM] }),
  }).then((response) => response.json());

  return result;
}

export function fetchResourceBasedInference(
  session: Session,
  requestBody: ResourceBasedInferenceRequest
): Promise<ResourceBasedInferenceResponse | InferenceError> {
  const result = fetch(`${BASE_URL}/infer`, {
    method: 'POST',
    headers: createHeaders(session.accessToken),
    body: JSON.stringify(requestBody), // Add an empty JSON object as the request body
  }).then((response) => response.json());

  return result;
}
