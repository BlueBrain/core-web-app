'use server';

import { revalidateTag } from 'next/cache'

import { PaperCreationAction, PaperSchema } from './validation';
import { papersListTagGenerator } from './utils';
import { createFile, createResource } from "@/api/nexus";
import { auth } from "@/auth";
import { PaperResource } from "@/types/nexus";
import { composeUrl, createDistribution } from "@/util/nexus";
import { to64 } from '@/util/common';




export default async function initializePaperEntry(_prevState: PaperCreationAction, paper: FormData) {
  const session = await auth();
  if (!session) {
    throw Error("oops");
  }

  const { success, data, error } = PaperSchema.safeParse({
    virtualLabId: paper.get('virtual-lab-id'),
    projectId: paper.get('project-id'),
    title: paper.get('title'),
    summary: paper.get('summary'),
    sourceData: paper.get('source-data'),
    generateOutline: paper.get('generate-outline')
  });

  if (!success && error) {
    return {
      error: error.message,
      validationErrors: error.flatten().fieldErrors,
      redirect: null,
    }
  }

  try {
    const { virtualLabId, projectId, title, summary, sourceData, generateOutline } = data;

    const fileUrl = composeUrl('file', '', { org: data.virtualLabId, project: data.projectId });

    const fileMetadata = await createFile(
      'null',
      'lexical-editor--state.json',
      'application/json',
      session,
      fileUrl,
    );

    const resourceUrl = composeUrl('resource', '', {
      org: virtualLabId,
      project: projectId,
      sync: true,
      schema: null
    });

    const result = await createResource<PaperResource>(
      {
        '@context': ['https://bbp.neuroshapes.org'],
        '@type': ['Paper', 'Entity'],
        name: title,
        description: summary,
        sourceData,
        generateOutline,
        virtualLabId,
        projectId,
        tags: [],
        distribution: createDistribution(fileMetadata),
      },
      session,
      resourceUrl
    );


    revalidateTag(papersListTagGenerator({ virtualLabId, projectId }));

    return ({
      error: null,
      validationErrors: null,
      redirect:`/virtual-lab/lab/${virtualLabId}/project/${projectId}/papers/${to64(result['@id'])}`,
    })

  } catch (err) {
    return ({
      redirect: null,
      validationErrors: null,
      error: (err as ({ message: string })).message
    });
  }
}
