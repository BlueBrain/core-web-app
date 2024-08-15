import { blueNaasUrl } from '@/config';
import { createHeaders } from '@/util/utils';

export default async function getMorphology({
  modelId,
  token,
}: {
  modelId: string;
  token: string;
}) {
  const response = await fetch(
    `${blueNaasUrl}/morphology?model_id=${encodeURIComponent(modelId)}`,
    {
      method: 'get',
      headers: createHeaders(token, {
        accept: 'application/x-ndjson',
      }),
    }
  );

  return response;
}
