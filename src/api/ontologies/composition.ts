import { createHeaders } from '@/util/utils';
import { composeUrl } from '@/util/nexus';

const getCompositionData = (accessToken: string) => {
  if (!accessToken) throw new Error('Access token should be defined');
  const url = composeUrl(
    'file',
    'https://bbp.epfl.ch/neurosciencegraph/data/17d763db-4eea-42e4-b3aa-d4662baae2f3',
    { org: 'bbp', project: 'atlasdatasetrelease' }
  );
  return fetch(url, {
    method: 'GET',
    headers: createHeaders(accessToken, { Accept: '*/*' }),
  }).then((response) => response.json());
};

export default getCompositionData;
