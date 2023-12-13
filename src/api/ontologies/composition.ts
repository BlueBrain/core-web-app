import { createHeaders } from '@/util/utils';
import { composeUrl } from '@/util/nexus';
import { cellCompositionFile } from '@/config';

const getCompositionData = (accessToken: string) => {
  if (!accessToken) throw new Error('Access token should be defined');

  const { org, project, id } = cellCompositionFile;
  const url = composeUrl('file', id, { org, project });

  return fetch(url, {
    method: 'GET',
    headers: createHeaders(accessToken, { Accept: '*/*' }),
  }).then((response) => response.json());
};

export default getCompositionData;
