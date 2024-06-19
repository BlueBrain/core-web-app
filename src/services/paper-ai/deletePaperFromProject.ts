'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { captureException } from '@sentry/nextjs';

import { papersListTagGenerator } from './utils';
import { PaperResource } from '@/types/nexus';
import { auth } from '@/auth';
import { composeUrl } from '@/util/nexus';
import { createHeaders } from '@/util/utils';

export default async function deletePaperFromProject({ paper }: { paper: PaperResource }) {
  const session = await auth();
  if (!session) {
    throw new Error('The supplied authentication is not authorized for this action');
  }

  let shouldRedirect = false;
  try {
    const response = await fetch(
      composeUrl('resource', paper['@id'], {
        org: paper.virtualLabId,
        project: paper.projectId,
        rev: paper._rev,
        sync: true,
      }),
      {
        method: 'DELETE',
        headers: createHeaders(session.accessToken),
      }
    );
    if (!response.ok) {
      captureException(new Error(await response.json()), {
        tags: { section: 'paper', feature: 'delete_paper' },
        extra: {
          virtualLabId: paper.virtualLabId,
          projectId: paper.projectId,
          action: 'delta_delete_paper_resource',
        },
      });
      throw new Error('Resource deprecation failed');
    }
    revalidateTag(
      papersListTagGenerator({
        virtualLabId: paper.virtualLabId,
        projectId: paper.projectId,
      })
    );
    shouldRedirect = true;
  } catch (error) {
    captureException(error, {
      tags: { section: 'paper', feature: 'delete_paper' },
      extra: {
        virtualLabId: paper.virtualLabId,
        projectId: paper.projectId,
        action: 'server_delete_paper_resource',
      },
    });
    throw Error('Resource deprecation failed');
  }

  if (shouldRedirect) {
    redirect(`/virtual-lab/lab/${paper.virtualLabId}/project/${paper.projectId}/papers`);
  }
}
