import { Session } from 'next-auth';
import { SerializedEditorState } from 'lexical/LexicalEditorState';
import { captureException } from '@sentry/nextjs';

import { fetchJsonFileByUrl } from '@/api/nexus';
import { PaperResource } from '@/types/nexus';
import { from64 } from '@/util/common';
import { composeUrl } from '@/util/nexus';
import { createHeaders } from '@/util/utils';

export default async function retrievePaperLexicalConfig({
  virtualLabId,
  projectId,
  paperId,
  session,
}: {
  virtualLabId: string;
  projectId: string;
  paperId: string; // as base64
  session: Session;
}): Promise<{
  paper: PaperResource;
  config: SerializedEditorState;
}> {
  let remotePaperResource = null;
  let editorStateObj = null;
  try {
    const resourceResponse = await fetch(
      composeUrl('resource', from64(decodeURIComponent(paperId)), {
        org: virtualLabId,
        project: projectId,
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
      console.log('[ERROR][PAPER_FETCH]', errorData);
      captureException(errorMessage);
      throw new Error(`API Error (${resourceResponse.status}): ${errorMessage}`);
    }
    remotePaperResource = await resourceResponse.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('[ERROR][PAPER_FETCH]', error);
    captureException(error);
    throw new Error('Paper resource not found');
  }

  try {
    editorStateObj = await fetchJsonFileByUrl<SerializedEditorState>(
      remotePaperResource.distribution.contentUrl,
      session
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('[ERROR][FILE_CONFIG_FETCH]', error);
    captureException(error);
    throw new Error('Paper configuration not found');
  }

  return {
    paper: remotePaperResource,
    config: editorStateObj,
  };
}
