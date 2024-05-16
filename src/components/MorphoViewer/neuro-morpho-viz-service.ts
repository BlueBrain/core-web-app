import { createHeaders } from '@/util/utils';
import { thumbnailGenerationBaseUrl } from '@/config';

export async function fetchSomaFromNeuroMorphoViz(
  contentUrl: string,
  accessToken: string | undefined
): Promise<ArrayBuffer | null> {
  if (!accessToken) return null;

  const url = `${thumbnailGenerationBaseUrl}/soma/process-nexus-swc?content_url=${encodeURIComponent(contentUrl)}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: createHeaders(accessToken, {
      Accept: 'application/json',
    }),
  });
  const data = await resp.arrayBuffer();
  return data;
}
