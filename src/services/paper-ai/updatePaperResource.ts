'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import uniqBy from 'lodash/uniqBy';
import { captureException } from '@sentry/nextjs';

import { PaperUpdateAction, PaperUpdateSchema } from './validation';
import { paperHrefGenerator, papersListTagGenerator } from './utils';
import { auth } from '@/auth';
import { EntityResource, PaperResource } from '@/types/nexus';
import { composeUrl, removeMetadata } from '@/util/nexus';
import { createHeaders } from '@/util/utils';

export default async function updatePaperDetails(
  _prevState: PaperUpdateAction,
  paperData: FormData
): Promise<PaperUpdateAction> {
  const session = await auth();

  if (!session) {
    throw new Error('The supplied authentication is not authorized for this action');
  }

  const { success, data, error } = PaperUpdateSchema.safeParse({
    title: paperData.get('title'),
    summary: paperData.get('summary'),
    sourceData: paperData.get('source-data'),
    paper: paperData.get('paper'),
  });

  if (!success && error) {
    return {
      type: 'error',
      error: error.message,
      validationErrors: error.flatten().fieldErrors,
    };
  }

  const { title, summary, sourceData } = data;
  const paper = JSON.parse(data.paper) as PaperResource;
  let remotePaperResource = null;

  try {
    const resourceResponse = await fetch(
      composeUrl('resource', paper['@id'], {
        rev: paper._rev,
        sync: true,
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
      captureException(errorMessage, {
        tags: { section: 'paper', feature: 'update_papers' },
        extra: {
          virtualLabId: paper.virtualLabId,
          projectId: paper.projectId,
          action: 'delta_fetch_latest_paper_details',
        },
      });
      throw new Error(`API Error (${resourceResponse.status}): ${errorMessage}`);
    }
    remotePaperResource = await resourceResponse.json();
  } catch (err) {
    captureException(err, {
      tags: { section: 'paper', feature: 'update_papers' },
      extra: {
        virtualLabId: paper.virtualLabId,
        projectId: paper.projectId,
        action: 'server_fetch_latest_paper_details',
      },
    });
    throw new Error('Paper resource not found');
  }

  try {
    const response = await fetch(
      composeUrl('resource', paper['@id'], {
        rev: remotePaperResource._rev,
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
            name: title,
            description: summary,
            sourceData: uniqBy([...paper.sourceData, ...(sourceData || [])], 'id'),
          }) as EntityResource
        ),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      captureException(new Error(errorResponse), {
        tags: { section: 'paper', feature: 'update_papers' },
        extra: {
          virtualLabId: paper.virtualLabId,
          projectId: paper.projectId,
          action: 'delta_update_paper_details',
          reason: 'reason' in errorResponse ? errorResponse.reason : undefined,
        },
      });
      throw new Error('Failed to update paper details');
    }

    revalidateTag(
      papersListTagGenerator({
        virtualLabId: paper.virtualLabId,
        projectId: paper.projectId,
      })
    );

    revalidatePath(
      paperHrefGenerator({
        virtualLabId: paper.virtualLabId,
        projectId: paper.projectId,
        '@id': paper['@id'],
      })
    );

    return {
      type: 'success',
      validationErrors: null,
      error: null,
    };
  } catch (err: any) {
    captureException(err, {
      tags: { section: 'paper', feature: 'update_papers' },
      extra: {
        virtualLabId: paper.virtualLabId,
        projectId: paper.projectId,
        action: 'server_update_paper_details',
      },
    });
    return {
      type: 'error',
      error: err instanceof Error ? err.message : 'Unknown error',
      validationErrors: null,
    };
  }
}
