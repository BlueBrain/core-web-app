import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useAtomValue } from 'jotai';

import calculateJSONDigest from '@/components/papers/utils/calculateJSONDigest';
import sessionAtom from '@/state/session';
import { PaperResource } from '@/types/nexus';
import useNotification from '@/hooks/notifications';
import { createHeaders } from '@/util/utils';

const FLUSH_SYNC_TIMEOUT = 10000;
export const EDITOR_AUTO_SAVE_SUCCESS_EVENT = 'EDITOR_AUTO_SAVE_SUCCESS_EVENT';
export const EDITOR_AUTO_SAVING_START_EVENT = 'EDITOR_AUTO_SAVING_START_EVENT';
export const EDITOR_AUTO_SAVE_FAILED_EVENT = 'EDITOR_AUTO_SAVE_FAILED_EVENT';

type Props = {
  paper: PaperResource;
};

export default function RemoteSyncPlugin({ paper }: Props) {
  const [editor] = useLexicalComposerContext();
  const session = useAtomValue(sessionAtom);
  const abortControllerRef = useRef<AbortController | null>(null);
  const prevDigestRef = useRef(calculateJSONDigest(editor.getEditorState().toJSON()));
  const { error: errorNotify } = useNotification();

  useEffect(() => {
    const update = async () => {
      try {
        if (session && paper && !editor.isComposing()) {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
          abortControllerRef.current = new AbortController();
          const currentDigestRef = calculateJSONDigest(editor.getEditorState().toJSON());

          const [currentDigest, prevDigest] = await Promise.all([
            currentDigestRef,
            prevDigestRef.current,
          ]);

          if (currentDigest !== prevDigest) {
            window.dispatchEvent(new CustomEvent(EDITOR_AUTO_SAVING_START_EVENT));
            const result = await fetch('/api/paper-ai/sync', {
              method: 'POST',
              headers: createHeaders(session.accessToken),
              body: JSON.stringify({
                paper,
                state: editor.getEditorState().toJSON(),
              }),
              signal: abortControllerRef.current.signal,
            });

            const data = await result.json();
            window.dispatchEvent(new CustomEvent(EDITOR_AUTO_SAVE_SUCCESS_EVENT, { detail: data }));
            abortControllerRef.current = null;
            prevDigestRef.current = currentDigestRef;
          }
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          window.dispatchEvent(new CustomEvent(EDITOR_AUTO_SAVE_FAILED_EVENT, { detail: error }));
          errorNotify(`
            Error while syncing data with remote storage,
            ${(error as Error).message}
          `);
        }
      }
    };

    const id = setInterval(update, FLUSH_SYNC_TIMEOUT);

    return () => clearInterval(id);
  }, [editor, session, paper, errorNotify]);

  return null;
}
