'use server';

import { ZodError } from 'zod';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { createHeadlessEditor } from '@lexical/headless';
import { $convertFromMarkdownString } from '@lexical/markdown';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeNode } from '@lexical/code';
import { captureException } from '@sentry/nextjs';

import generateOutlineAi from './generateOutlineAi';
import { PaperCreationAction, PaperSchema, PaperSchemaType } from './validation';
import { paperHrefGenerator, papersListTagGenerator } from './utils';
import { auth } from '@/auth';
import { createFile, createResource } from '@/api/nexus';
import { FileMetadata, PaperResource } from '@/types/nexus';
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
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('[ERROR][INIT_PAPER][JSON_MARKDOWN]', error);
      captureException(error);
      reject(error);
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

  let data: PaperSchemaType | null = null;
  let redirectUrl: string | null = null;
  let fileMetadata: FileMetadata | null = null;

  try {
    data = await PaperSchema.parseAsync({
      virtualLabId: paper.get('virtual-lab-id'),
      projectId: paper.get('project-id'),
      title: paper.get('title'),
      summary: paper.get('summary'),
      sourceData: paper.get('source-data'),
      generateOutline: paper.get('generate-outline'),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('[ERROR][INIT_PAPER][DATA_VALIDATION]', error);
    captureException(error);
    if (error instanceof ZodError) {
      return {
        error: error.message,
        validationErrors: error.flatten().fieldErrors,
        redirect: null,
      };
    }
    return {
      error: (error as any).message,
      validationErrors: null,
      redirect: null,
    };
  }

  const { virtualLabId, projectId, title, summary, generateOutline, sourceData } = data!;

  try {
    const fileUrl = composeUrl('file', '', { org: virtualLabId, project: projectId });

    let EDITOR_STATE = DEFAULT_EDITOR_STATE;
    if (generateOutline) {
      const result = await generateOutlineAi(title, summary);
      EDITOR_STATE = await getJson(result);
    }

    fileMetadata = await createFile(
      EDITOR_STATE,
      DEFAULT_EDITOR_CONFIG_NAME,
      DEFAULT_EDITOR_CONFIG_FORMAT,
      session,
      fileUrl
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('[ERROR][INIT_PAPER][FILE_CREATE]', error);
    captureException(error);
    return {
      redirect: null,
      validationErrors: null,
      error: 'Create Paper configuration failed',
    };
  }

  try {
    const resourceUrl = composeUrl('resource', '', {
      org: virtualLabId,
      project: projectId,
      sync: true,
      schema: null,
    });

    const result = await createResource<PaperResource>(
      {
        sourceData,
        generateOutline,
        virtualLabId,
        projectId,
        tags: [],
        name: title,
        description: summary,
        '@context': ['https://bbp.neuroshapes.org'],
        '@type': ['Paper', 'Entity'],
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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('[ERROR][INIT_PAPER][RESOURCE_CREATE]', error);
    captureException(error);
    return {
      redirect: null,
      validationErrors: null,
      error: 'Creating paper resource failed',
    };
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }
}
