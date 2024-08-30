import { blueNaasUrl } from '@/config';
import { SingleSynaptomeConfig } from '@/types/synaptome';
import { createHeaders } from '@/util/utils';

export default async function getSynapsesPlacement({
  modelId,
  seed,
  config,
  token,
  signal,
}: {
  token: string;
  modelId: string;
  seed: number;
  config: SingleSynaptomeConfig;
  signal?: AbortSignal;
}) {
  const response = await fetch(
    `${blueNaasUrl}/synaptome/generate-placement?model_id=${encodeURIComponent(modelId)}`,
    {
      method: 'post',
      headers: createHeaders(token),
      body: JSON.stringify({
        seed,
        config,
      }),
      signal,
    }
  );
  return response;
}
