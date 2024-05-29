'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/button-has-type */

import { useState } from 'react';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';

import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import ToolbarPlugin from './plugins/ToolbarPlugin';
import RemoteStorePlugin from './plugins/RemoteStorePlugin';
import CommandsPlugin from './plugins/CommandsPlugin';

import style from './paper-editor.module.css';

const theme = {
  root: 'p-4 border-slate-500 border-2 rounded h-full min-h-[200px] focus:outline-none focus-visible:border-black',
};

function onError(error: Error) {
  // eslint-disable-next-line no-console
  console.error(error);
}

interface EditorProps {
  virtualLabId: string;
  projectId: string;
  paperId: string;
}

export default function Editor({ virtualLabId, projectId, paperId }: EditorProps) {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
  };

  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div>
      <LexicalComposer initialConfig={initialConfig}>
        <div className={style.editorContainer}>
          <RemoteStorePlugin virtualLabId={virtualLabId} projectId={projectId} paperId={paperId} />
          <CommandsPlugin />
          <ToolbarPlugin />
          <div className={style.editorInner}>
            <RichTextPlugin
              contentEditable={<ContentEditable className={style.editorInput} />}
              placeholder={<div>Enter some text...</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}
