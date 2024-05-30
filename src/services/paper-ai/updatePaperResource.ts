'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { PaperUpdateAction, PaperUpdateSchema } from './validation';
import { paperHrefGenerator, papersListTagGenerator } from './utils';
import { auth } from '@/auth';
import { EntityResource, PaperResource } from '@/types/nexus';
import { composeUrl } from '@/util/nexus';
import { createHeaders } from '@/util/utils';

export default async function updatePaperDetails(
  _prevState: PaperUpdateAction,
  paperData: FormData
): Promise<PaperUpdateAction> {
  const session = await auth();

  if (!session) {
    throw Error('oops');
  }

  try {
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
    const paper = data.paper as PaperResource;

    const response = await fetch(
      composeUrl('resource', paper['@id'], {
        rev: paper._rev,
        sync: true,
        org: paper.virtualLabId,
        project: paper.projectId,
      }),
      {
        method: 'PUT',
        headers: createHeaders(session.accessToken),
        body: JSON.stringify({
          ...paper,
          name: title,
          description: summary,
          sourceData,
        } as EntityResource),
        cache: 'no-store',
      }
    );
    if (response.ok) {
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
    }
    return {
      type: 'error',
      error: await response.text(),
      validationErrors: null,
    };
  } catch (err) {
    return {
      type: 'error',
      error: (err as { message: string }).message,
      validationErrors: null,
    };
  }
}
