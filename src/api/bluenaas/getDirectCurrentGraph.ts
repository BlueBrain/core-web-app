import { blueNaasUrl } from '@/config';
import {
  CurrentInjectionGraphResponse,
  CurrentInjectionGraphRequest,
} from '@/types/simulation/graph';
import { convertObjectKeystoSnakeCase } from '@/util/object-keys-format';

export default async function getStimuliPlot(
  modelSelfUrl: string,
  token: string,
  config: CurrentInjectionGraphRequest,
  signal?: AbortSignal
): Promise<CurrentInjectionGraphResponse[]> {
  const formattedConfig = convertObjectKeystoSnakeCase(config);
  const response = await fetch(
    `${blueNaasUrl}/graph/direct-current-plot?model_self=${encodeURIComponent(modelSelfUrl)}`,
    {
      signal,
      method: 'post',
      headers: {
        accept: 'application/json',
        authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedConfig),
    }
  );
  if (response.ok) {
    return await response.json();
  }
  throw new Error('Stimuli plot could not be retrieved');
}
