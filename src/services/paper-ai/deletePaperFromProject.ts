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
    captureException(new Error(`Resource deprecation failed`));
    throw Error('Resource deprecation failed');
  }

  if (shouldRedirect) {
    redirect(`/virtual-lab/lab/${paper.virtualLabId}/project/${paper.projectId}/papers`);
  }
}
