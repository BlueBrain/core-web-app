import { captureException } from '@sentry/nextjs';

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
  let resourceJson: PaperResource | null = null;
  let remoteConfigState: FileMetadata | null = null;

  try {
    const resourceResponse = await fetch(
      composeUrl('resource', paper['@id'], {
        org: paper.virtualLabId,
        project: paper.projectId,
      }),
      {
        headers: createHeaders(session.accessToken),
        cache: 'no-store',
      }
    );

    if (!resourceResponse.ok) {
      const errorData = await resourceResponse.json();
      const errorMessage =
        errorData?.error?.message || errorData?.error || resourceResponse.statusText;
      captureException(new Error(errorMessage));
      throw new Error(`API Error (${resourceResponse.status}): ${errorMessage}`);
    }

    resourceJson = await resourceResponse.json();
  } catch (error) {
    captureException(error);
    return new Response('ServerError: Fetch paper resource failed', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }

  try {
    const { contentUrl, name } = resourceJson!.distribution;
    const formData = new FormData();
    const dataBlob = new Blob([JSON.stringify(state)], { type: 'application/json' });

    formData.append('file', dataBlob, name);

    const fileResponse = await fetch(contentUrl, {
      method: 'PUT',
      headers: createHeaders(session.accessToken, null),
      body: formData,
      cache: 'no-store',
    });

    if (!fileResponse.ok) {
      const errorData = await fileResponse.json();
      const errorMessage = errorData?.error?.message || errorData?.error || fileResponse.statusText;
      throw new Error(`API Error (${fileResponse.status}): ${errorMessage}`);
    }

    remoteConfigState = await fileResponse.json();
  } catch (error) {
    captureException(error);
    return new Response('ServerError: Updating paper configuration file failed', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }

  try {
    const updatedResource = removeMetadata({
      ...paper,
      distribution: createDistribution(
        remoteConfigState!,
        `${remoteConfigState!._self}?rev=${remoteConfigState!._rev}`
      ),
    });

    const updateResourceResponse = await fetch(
      composeUrl('resource', paper['@id'], {
        rev: resourceJson!._rev,
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
    const updateResource = await updateResourceResponse.json();

    if (!updateResourceResponse.ok) {
      const errorMessage =
        updateResource?.error?.message ||
        updateResource?.error ||
        updateResourceResponse.statusText;
      throw new Error(`API Error (${updateResourceResponse.status}): ${errorMessage}`);
    }

    return Response.json({
      message: 'Paper state and configuration updated successfully',
      data: updateResource,
    });
  } catch (error) {
    captureException(error);
    return new Response('ServerError: Updating paper resource failed', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
};
