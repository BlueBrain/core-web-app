import { createHeaders } from '@/util/utils';

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
export const fetchPointCloud = (url: string) =>
  fetch(url, {
    method: 'get',
    headers: new Headers({
      Accept: '*/*',
    }),
  }).then((response) => response.arrayBuffer());
