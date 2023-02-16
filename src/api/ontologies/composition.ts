import { createHeaders } from '@/util/utils';
import { composeUrl } from '@/util/nexus';

const getCompositionData = (accessToken: string) => {
  if (!accessToken) throw new Error('Access token should be defined');
  const url = composeUrl(
    'file',
    'https://bbp.epfl.ch/neurosciencegraph/data/182e8ec7-7b9d-455b-a621-90108623ab76',
    { org: 'bbp', project: 'atlasdatasetrelease' }
  );
  return fetch(url, {
    method: 'GET',
    headers: createHeaders(accessToken, { Accept: '*/*' }),
  }).then((response) => response.json());
};

export default getCompositionData;
