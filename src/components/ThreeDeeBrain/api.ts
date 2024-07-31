import { createHeaders } from '@/util/utils';
import { BRAIN_REGION_DOES_NOT_EXIST } from '@/constants/errors';
import { nexus } from '@/config';

/**
 * Fetches the mesh data from nexus
 * @param accessToken
 * @param distributionID
 */
export const fetchMesh = (accessToken: string, distributionID: string) =>
  fetch(distributionID, {
    method: 'get',
    headers: createHeaders(accessToken),
  }).then((response) => response.text());
/**
 * Fetches the point cloud data from the Cells API
 *
 * @param url
 */
export const fetchPointCloud = (url: string, token: string, bucket: string) =>
  fetch(url, {
    method: 'get',
    headers: new Headers({
      Accept: '*/*',
      'nexus-token': token,
      'nexus-endpoint': nexus.url,
      'nexus-bucket': bucket,
    }),
  }).then((response) => {
    if (!response.ok) {
      return response.json().then((errorData) => {
        if (errorData.message.includes('No region ids found with region')) {
          throw new Error(BRAIN_REGION_DOES_NOT_EXIST);
        }
        throw new Error(errorData.message);
      });
    }
    return response.arrayBuffer();
  });
