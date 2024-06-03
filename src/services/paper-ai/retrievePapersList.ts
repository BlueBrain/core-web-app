import { papersListCountTagGenerator, papersListTagGenerator } from './utils';
import { nexus } from '@/config';
import { getPaperCountQuery, getPaperListQuery } from '@/queries/es';
import { PaperResource } from '@/types/nexus';
import { composeUrl } from '@/util/nexus';
import { createHeaders } from '@/util/utils';

export default async function retrievePapersList({
  virtualLabId,
  projectId,
  accessToken,
}: {
  virtualLabId: string;
  projectId: string;
  accessToken: string;
}): Promise<{
  total: number;
  papers: Array<PaperResource>;
}> {
  const query = getPaperListQuery();
  const apiUrl = composeUrl('view', nexus.defaultESViewId, {
    viewType: 'es',
    org: virtualLabId,
    project: projectId,
  });
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify(query),
    cache: 'no-store',
    next: {
      tags: [papersListTagGenerator({ virtualLabId, projectId })],
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData?.error?.message || errorData?.error || response.statusText;
    throw new Error(`API Error (${response.status}): ${errorMessage}`);
  }
  const json = await response.json();

  return {
    total: json.hits.total.value,
    papers: json.hits.hits.map((hit: any) => hit._source),
  };
}

export async function retrievePapersListCount({
  virtualLabId,
  projectId,
  accessToken,
}: {
  virtualLabId: string;
  projectId: string;
  accessToken: string;
}): Promise<{
  total: number;
}> {
  const query = getPaperCountQuery();
  const apiUrl = composeUrl('view', nexus.defaultESViewId, {
    viewType: 'es',
    org: virtualLabId,
    project: projectId,
  });
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: createHeaders(accessToken),
    body: JSON.stringify(query),
    cache: 'no-store',
    next: {
      tags: [papersListCountTagGenerator({ virtualLabId, projectId })],
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData?.error?.message || errorData?.error || response.statusText;
    throw new Error(`API Error (${response.status}): ${errorMessage}`);
  }
  const json = await response.json();

  return {
    total: json.aggregations.total.value,
  };
}
