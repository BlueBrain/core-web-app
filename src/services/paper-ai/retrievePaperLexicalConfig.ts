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
  let remotePaperResource = null;
  let editorStateObj = null;
  try {
    remotePaperResource = await fetchResourceById<PaperResource>(
      from64(decodeURIComponent(paperId)),
      session,
      {
        org: virtualLabId,
        project: projectId,
      }
    );
  } catch (error) {
    throw new Error('Paper resource not found');
  }
  try {
    editorStateObj = await fetchJsonFileByUrl<SerializedEditorState>(
      remotePaperResource.distribution.contentUrl,
      session
    );
  } catch (error) {
    throw new Error('Paper configuration not found');
  }

  return {
    paper: remotePaperResource,
    config: editorStateObj,
  };
}
