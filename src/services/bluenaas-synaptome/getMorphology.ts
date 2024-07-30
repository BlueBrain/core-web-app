import { getSession } from '@/authFetch';
import { blueNaasUrl } from '@/config';
import { createHeaders } from '@/util/utils';

export default async function getMorphology({ modelId }: { modelId: string }) {
  const session = await getSession();
  const response = await fetch(
    `${blueNaasUrl}/morphology?model_id=${encodeURIComponent(modelId)}`,
    {
      method: 'get',
      headers: createHeaders(session.accessToken, {
        accept: 'application/x-ndjson',
      }),
    }
  );

  return response;
}
