import { getSession } from '@/authFetch';
import { blueNaasUrl } from '@/config';
import { SingleSynaptomeConfig } from '@/types/synaptome';
import { createHeaders } from '@/util/utils';

export default async function getSynapsesPlacement({
  modelId,
  seed,
  config,
}: {
  modelId: string;
  seed: number;
  config: SingleSynaptomeConfig;
}) {
  const session = await getSession();
  const response = await fetch(
    `${blueNaasUrl}/synaptome/generate-placement?model_id=${encodeURIComponent(modelId)}`,
    {
      method: 'post',
      headers: createHeaders(session.accessToken),
      body: JSON.stringify({
        seed,
        config,
      }),
    }
  );
  return response;
}
