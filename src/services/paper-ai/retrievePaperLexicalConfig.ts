import { Session } from 'next-auth';
import { SerializedEditorState } from 'lexical/LexicalEditorState';
import { captureException } from '@sentry/nextjs';
import find from 'lodash/find';

import { DEFAULT_EDITOR_CONFIG_NAME } from './utils';
import { fetchJsonFileByUrl } from '@/api/nexus';
import { PaperResource } from '@/types/nexus';
import { from64 } from '@/util/common';
import { composeUrl, ensureArray } from '@/util/nexus';
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
      captureException(new Error(errorMessage), {
        tags: { section: 'paper', feature: 'get_paper_config' },
        extra: {
          virtualLabId,
          projectId,
          action: 'delta_fetch_latest_paper_details',
        },
      });
      throw new Error(`API Error (${resourceResponse.status}): ${errorMessage}`);
    }
    remotePaperResource = await resourceResponse.json();
  } catch (error) {
    captureException(error, {
      tags: { section: 'paper', feature: 'get_paper_config' },
      extra: {
        virtualLabId,
        projectId,
        action: 'server_fetch_latest_paper_details',
      },
    });
    throw new Error('Paper resource not found');
  }

  try {
    const configFile = find<PaperResource['distribution']>(
      ensureArray(remotePaperResource.distribution),
      ['name', DEFAULT_EDITOR_CONFIG_NAME]
    );

    editorStateObj = await fetchJsonFileByUrl<SerializedEditorState>(
      configFile?.contentUrl!,
      session
    );
  } catch (error) {
    captureException(error, {
      tags: { section: 'paper', feature: 'get_paper_config' },
      extra: {
        virtualLabId,
        projectId,
        action: 'server_fetch_latest_paper_config_file',
      },
    });
    throw new Error('Paper configuration not found');
  }

  return {
    paper: remotePaperResource,
    config: editorStateObj,
  };
}
