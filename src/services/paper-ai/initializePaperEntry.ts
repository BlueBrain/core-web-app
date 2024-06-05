'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { createHeadlessEditor } from '@lexical/headless';
import { $convertFromMarkdownString } from '@lexical/markdown';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeNode } from '@lexical/code';

import generateOutlineAi from './generateOutlineAi';
import { PaperCreationAction, PaperSchema } from './validation';
import { paperHrefGenerator, papersListTagGenerator } from './utils';
import { createFile, createResource } from '@/api/nexus';
import { auth } from '@/auth';
import { PaperResource } from '@/types/nexus';
import { composeUrl, createDistribution } from '@/util/nexus';

const DEFAULT_EDITOR_STATE =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';
const DEFAULT_EDITOR_CONFIG_NAME = 'lexical-editor--state.json';
const DEFAULT_EDITOR_CONFIG_FORMAT = 'application/json';

export async function getJson(markdown: string) {
  const json = await new Promise<string>((resolve, reject) => {
    try {
      const editor = createHeadlessEditor({
        nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, LinkNode],
        onError: (error) => {
          throw error;
        },
      });
      editor.update(
        () => {
          $convertFromMarkdownString(markdown);
        },
        {
          discrete: true,
        }
      );
      resolve(JSON.stringify(editor.getEditorState().toJSON()));
    } catch (er) {
      reject(er);
    }
  });

  return json;
}

export default async function initializePaperEntry(
  _prevState: PaperCreationAction,
  paper: FormData
) {
  const session = await auth();
  if (!session) {
    throw new Error('The supplied authentication is not authorized for this action');
  }

  const { success, data, error } = PaperSchema.safeParse({
    virtualLabId: paper.get('virtual-lab-id'),
    projectId: paper.get('project-id'),
    title: paper.get('title'),
    summary: paper.get('summary'),
    sourceData: paper.get('source-data') ?? 'sourced-data',
    generateOutline: paper.get('generate-outline'),
  });

  if (!success && error) {
    return {
      error: error.message,
      validationErrors: error.flatten().fieldErrors,
      redirect: null,
    };
  }

  let redirectUrl: string | null = null;
  try {
    const { virtualLabId, projectId, title, summary, sourceData, generateOutline } = data;
    const fileUrl = composeUrl('file', '', { org: data.virtualLabId, project: data.projectId });

    let EDITOR_STATE = DEFAULT_EDITOR_STATE;
    if (generateOutline) {
      const result = await generateOutlineAi(title, summary);
      EDITOR_STATE = await getJson(result);
    }

    const fileMetadata = await createFile(
      EDITOR_STATE,
      DEFAULT_EDITOR_CONFIG_NAME,
      DEFAULT_EDITOR_CONFIG_FORMAT,
      session,
      fileUrl
    );

    const resourceUrl = composeUrl('resource', '', {
      org: virtualLabId,
      project: projectId,
      sync: true,
      schema: null,
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
        distribution: createDistribution(
          fileMetadata,
          composeUrl('file', fileMetadata['@id'], {
            rev: fileMetadata._rev,
            org: virtualLabId,
            project: projectId,
          })
        ),
      },
      session,
      resourceUrl
    );

    revalidateTag(papersListTagGenerator({ virtualLabId, projectId }));
    redirectUrl = `${paperHrefGenerator({ virtualLabId, projectId, '@id': result['@id'] })}?from=create`;
  } catch (err) {
    return {
      redirect: null,
      validationErrors: null,
      error: (err as { message: string }).message,
    };
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }
}
