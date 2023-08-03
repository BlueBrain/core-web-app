import { Session } from 'next-auth';
import { createHeaders } from '@/util/utils';
import { RuleOuput } from '@/types/explore-section/kg-inference';

const BASE_URL = 'https://kg-inference-api.kcp.bbp.epfl.ch';

export function fetchRules(session: Session): Promise<RuleOuput[]> {
  const result = fetch(`${BASE_URL}/rules`, {
    method: 'POST',
    headers: createHeaders(session.accessToken),
    body: JSON.stringify({}), // Add an empty JSON object as the request body
  }).then((response) => response.json());

  return result;
}
