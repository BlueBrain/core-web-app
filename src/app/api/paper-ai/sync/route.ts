import { auth } from '@/auth';
import { FileMetadata, PaperResource } from '@/types/nexus';
import { composeUrl, createDistribution, removeMetadata } from '@/util/nexus';
import { createHeaders } from '@/util/utils';

type RequestBody = {
  paper: PaperResource;
  state: string;
};

export const POST = async (request: Request) => {
  const { paper, state } = (await request.json()) as RequestBody;
  const session = await auth();

  if (!session) {
    return new Response('Unauthorized', {
      status: 401,
      statusText: 'The supplied authentication is not authorized for this action',
    });
  }

  try {
    const url = composeUrl('resource', paper['@id'], {
      org: paper.virtualLabId,
      project: paper.projectId,
    });
    const resource = await fetch(url, {
      headers: createHeaders(session.accessToken),
      cache: 'no-store',
    });
    const resourceJson = (await resource.json()) as PaperResource;

    const { contentUrl, name } = resourceJson.distribution;
    const formData = new FormData();
    const dataBlob = new Blob([JSON.stringify(state)], { type: 'application/json' });

    formData.append('file', dataBlob, name);

    const response = await fetch(contentUrl, {
      method: 'PUT',
      headers: createHeaders(session.accessToken, null),
      body: formData,
      cache: 'no-store',
    });
    const remoteState: FileMetadata = await response.json();

    const updatedResource = removeMetadata({
      ...paper,
      distribution: createDistribution(remoteState, `${remoteState._self}?rev=${remoteState._rev}`),
    });

    const data = await fetch(
      composeUrl('resource', paper['@id'], {
        rev: resourceJson._rev,
        sync: true,
        org: paper.virtualLabId,
        project: paper.projectId,
      }),
      {
        method: 'PUT',
        headers: createHeaders(session.accessToken),
        body: JSON.stringify(updatedResource),
        cache: 'no-store',
      }
    );

    return Response.json({
      message: 'Paper state and configuration updated successfully',
      data: await data.json(),
    });
  } catch (error) {
    return new Response('ServerError: Updating paper relative files/resources failed', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
};
