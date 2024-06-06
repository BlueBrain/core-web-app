'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { captureException } from '@sentry/nextjs';

import { papersListTagGenerator } from './utils';
import { deprecateResource } from '@/api/nexus';
import { PaperResource } from '@/types/nexus';
import { auth } from '@/auth';

export default async function deletePaperFromProject({ paper }: { paper: PaperResource }) {
  const session = await auth();
  if (!session) {
    throw new Error('The supplied authentication is not authorized for this action');
  }

  let shouldRedirect = false;
  try {
    await deprecateResource(paper, session, {
      org: paper.virtualLabId,
      project: paper.projectId,
      rev: paper._rev,
      sync: true,
    });
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
