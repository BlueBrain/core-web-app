import { Session } from 'next-auth';
import { SerializedEditorState } from 'lexical/LexicalEditorState';

import { fetchJsonFileByUrl, fetchResourceById } from '@/api/nexus';
import { PaperResource } from '@/types/nexus';
import { from64 } from '@/util/common';

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
  try {
    const remotePaperResource = await fetchResourceById<PaperResource>(
      from64(decodeURIComponent(paperId)),
      session,
      {
        org: virtualLabId,
        project: projectId,
      }
    );

    const editorStateObj = await fetchJsonFileByUrl<SerializedEditorState>(
      remotePaperResource.distribution.contentUrl,
      session
    );

    return {
      paper: remotePaperResource,
      config: editorStateObj,
    };
  } catch (error) {
    throw new Error('Paper and config not found');
  }
}
