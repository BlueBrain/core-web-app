import { createHeaders } from '@/util/utils';
import { composeUrl } from '@/util/nexus';
import { cellCompositionFile } from '@/config';

/**
 * Function used to fetch the composition Data. The fetch pipeline followed is the following:
 *
 * Fetch Composition using tag => Get summary ID from composition
 * => Fetch Composition Summary using ID and tag =>  Get content URL from distribution of composition summ
 *
 * @param accessToken
 *
 * @returns
 */
const getCompositionData = (accessToken: string) => {
  if (!accessToken) throw new Error('Access token should be defined');

  const { org, project, id, tag } = cellCompositionFile;
  const url = composeUrl('resource', id, { org, project, tag });
  return fetch(url, {
    method: 'GET',
    headers: createHeaders(accessToken, { Accept: '*/*' }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Composition could not be retrieved');
      }
      return response.json();
    })
    .then((compositionData) => {
      const compositionSummaryId = compositionData.cellCompositionSummary['@id'];
      if (!compositionSummaryId) {
        throw new Error('Composition summary id could not be found');
      }
      const compositionSummaryUrl = composeUrl('resource', compositionSummaryId, {
        org,
        project,
        tag,
      });
      return fetch(compositionSummaryUrl, {
        method: 'GET',
        headers: createHeaders(accessToken, { Accept: '*/*' }),
      });
    })
    .then((compositionSummaryResponse) => {
      if (!compositionSummaryResponse.ok) {
        throw new Error('Composition summary could not be retrieved');
      }
      return compositionSummaryResponse.json();
    })
    .then((compositionSummaryData) => {
      const { contentUrl } = compositionSummaryData.distribution;
      if (!contentUrl) {
        throw new Error('Content URL not present in composition summary');
      }
      return fetch(contentUrl, {
        method: 'GET',
        headers: createHeaders(accessToken, { Accept: '*/*' }),
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Composition file could not be retrieved');
      }
      return response.json();
    });
};

export default getCompositionData;
