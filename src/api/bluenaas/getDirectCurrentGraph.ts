import { blueNaasUrl } from '@/config';
import {
  DirectCurrentInjectionGraphPlotResponse,
  DirectCurrentInjectionGraphRequest,
} from '@/types/simulation/graph';

export default async function getStimuliPlot(
  modelSelfUrl: string,
  token: string,
  config: DirectCurrentInjectionGraphRequest,
  signal?: AbortSignal
): Promise<DirectCurrentInjectionGraphPlotResponse[]> {
  const response = await fetch(
    `${blueNaasUrl}/graph/direct-current-plot?model_id=${encodeURIComponent(modelSelfUrl)}`,
    {
      method: 'post',
      headers: {
        accept: 'application/json',
        authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...config,
      }),
      signal
    },
  );
  if (response.ok) {
    return await response.json();
  }
  throw new Error('Stimuli plot could not be retrieved');
}
