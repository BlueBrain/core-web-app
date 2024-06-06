'use server';

import { revalidatePath } from 'next/cache';
import { captureException } from '@sentry/nextjs';
import reject from 'lodash/reject';
import isArray from 'lodash/isArray';

import { paperHrefGenerator } from './utils';
import { auth } from '@/auth';
import { EntityResource, PaperResource } from '@/types/nexus';
import { composeUrl, removeMetadata } from '@/util/nexus';
import { createHeaders } from '@/util/utils';
import { SourceDataItem } from '@/components/papers/PaperCreationView/data';

type UpdatePaperDetailsResponse = {
  status: 'success' | 'error';
};

export default async function updatePaperSourceData(
  paper: PaperResource,
  resource: SourceDataItem
): Promise<UpdatePaperDetailsResponse> {
  const session = await auth();

  if (!session) {
    throw new Error('The supplied authentication is not authorized for this action');
  }

  let resourceJson: PaperResource | null = null;

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
      // eslint-disable-next-line no-console
      console.log('[ERROR][INIT_PAPER][FETCH_RESOURCE_NEXUS]', errorData);
      captureException(errorMessage);
      throw new Error(`API Error (${resourceResponse.status}): ${errorMessage}`);
    }

    resourceJson = await resourceResponse.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('[ERROR][INIT_PAPER][FETCH_RESOURCE]', error);
    captureException(error);
    return {
      status: 'error',
    };
  }

  try {
    const sourceData = isArray(paper.sourceData)
      ? reject(paper.sourceData, { id: resource.id })
      : [];
    const response = await fetch(
      composeUrl('resource', resourceJson!['@id'], {
        rev: paper._rev,
        sync: true,
        org: paper.virtualLabId,
        project: paper.projectId,
      }),
      {
        method: 'PUT',
        headers: createHeaders(session.accessToken),
        body: JSON.stringify(
          removeMetadata({
            ...paper,
            sourceData,
          }) as EntityResource
        ),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      // eslint-disable-next-line no-console
      console.log('[ERROR][INIT_PAPER][DELETE_SOURCE_DATA_NEXUS]', errorResponse);
      if ('reason' in errorResponse) {
        captureException(errorResponse);
        throw new Error(errorResponse.reason);
      }
      captureException('Failed to update paper source data details');
      throw new Error('Failed to update paper source data details');
    }

    revalidatePath(
      paperHrefGenerator({
        virtualLabId: paper.virtualLabId,
        projectId: paper.projectId,
        '@id': paper['@id'],
      })
    );

    return {
      status: 'success',
    };
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('[ERROR][INIT_PAPER][DELETE_SOURCE_DATA]', error);
    captureException(error);
    return {
      status: 'error',
    };
  }
}
