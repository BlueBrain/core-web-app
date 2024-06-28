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
      captureException(new Error(errorMessage), {
        tags: { section: 'paper', feature: 'delete_paper_source_data' },
        extra: {
          virtualLabId: paper.virtualLabId,
          projectId: paper.projectId,
          action: 'delta_fetch_latest_paper_details',
        },
      });
      throw new Error(`API Error (${resourceResponse.status}): ${errorMessage}`);
    }

    resourceJson = await resourceResponse.json();
  } catch (error) {
    captureException(error, {
      tags: { section: 'paper', feature: 'delete_paper_source_data' },
      extra: {
        virtualLabId: paper.virtualLabId,
        projectId: paper.projectId,
        action: 'server_fetch_latest_paper_details',
      },
    });
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
      captureException('Failed to update paper source data details', {
        tags: { section: 'paper', feature: 'delete_paper_source_data' },
        extra: {
          virtualLabId: paper.virtualLabId,
          projectId: paper.projectId,
          action: 'delta_update_paper_source_data',
          reason: 'reason' in errorResponse ? errorResponse.reason : undefined,
        },
      });
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
    captureException(error, {
      tags: { section: 'paper', feature: 'delete_paper_source_data' },
      extra: {
        virtualLabId: paper.virtualLabId,
        projectId: paper.projectId,
        action: 'server_update_paper_source_data',
      },
    });
    return {
      status: 'error',
    };
  }
}
