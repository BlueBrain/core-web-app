import { blueNaasUrl } from '@/config';
import { SingleSynaptomeConfig } from '@/types/synaptome';
import { createHeaders } from '@/util/utils';

export default async function getSynapsesPlacement({
  modelId,
  seed,
  config,
  token,
}: {
  token: string;
  modelId: string;
  seed: number;
  config: SingleSynaptomeConfig;
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
    }
  );
  return response;
}
