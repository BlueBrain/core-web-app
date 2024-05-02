import { useAtomValue } from 'jotai';
import { EditorState, SerializedEditorState } from 'lexical';
import debounce from 'lodash/debounce';
import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import {
  fetchJsonFileByUrl,
  fetchResourceById,
  updateFileByUrl,
  updateResource,
} from '@/api/nexus';
import { autoSaveDebounceInterval } from '@/config';
import sessionAtom from '@/state/session';
import { PaperResource } from '@/types/nexus';
import { createDistribution, expandId } from '@/util/nexus';

interface RemoteStorePluginProps {
  virtualLabId?: string;
  projectId?: string;
  paperId: string;
}

export default function RemoteStorePlugin({
  paperId,
  // To be used after full vlab/project support is implemented.
  virtualLabId: _virtualLabId,
  projectId: _projectId,
}: RemoteStorePluginProps) {
  const session = useAtomValue(sessionAtom);

  const [editor] = useLexicalComposerContext();

  const [paperResource, setPaperResource] = useState<PaperResource>();

  const [initialised, setInitialised] = useState(false);

  // Fetch editor state from KG and initialise the editor.
  useEffect(() => {
    if (initialised || !session) return;

    const init = async () => {
      const remotePaperResource = await fetchResourceById<PaperResource>(
        expandId(paperId),
        session
      );
      const editorStateObj = await fetchJsonFileByUrl<SerializedEditorState>(
        remotePaperResource.distribution.contentUrl,
        session
      );

      if (editorStateObj) {
        editor.setEditorState(editor.parseEditorState(editorStateObj));
      }

      setInitialised(true);
      setPaperResource(remotePaperResource);
    };

    init();
  }, [editor, initialised, paperId, session]);

  // Persist user changes.
  useEffect(() => {
    const update = debounce(async (editorState: EditorState) => {
      if (!initialised || !session || !paperResource) return;

      // TODO Implement diff, save only if the current state differs from the saved one.

      const editorStateStr = JSON.stringify(editorState.toJSON());

      const updatedPayloadMeta = await updateFileByUrl(
        paperResource.distribution.contentUrl,
        editorStateStr,
        'lexical-editor-state.json',
        'application/json',
        session
      );

      const distribution = createDistribution(updatedPayloadMeta);
      const updatedPaperResource = {
        ...paperResource,
        '@type': ['Paper', 'Entity'],
        distribution,
      };

      const newResourceMeta = await updateResource(updatedPaperResource, session);

      // TODO make this type better.
      setPaperResource({ ...updatedPaperResource, ...(newResourceMeta as PaperResource) });
    }, autoSaveDebounceInterval);

    return editor.registerUpdateListener((editorState) => update(editorState.editorState));
  }, [editor, initialised, paperResource, session]);

  return null;
}
