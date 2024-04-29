'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/button-has-type */

import { useState, useLayoutEffect } from 'react';
import { Select } from 'antd';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection } from 'lexical';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';

import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import ToolbarPlugin from './plugins/ToolbarPlugin';
import RemoteStorePlugin from './plugins/RemoteStorePlugin';
import { expand, summarize } from './services/ml';

import style from './paper-editor.module.css';

function CommandSPlugin() {
  const [selectOpen, setSelectOpen] = useState(false);

  const [editor] = useLexicalComposerContext();

  const handleExpand = async () => {
    const text = editor.getEditorState().read(() => $getSelection()?.getTextContent());

    if (!text) return;

    const expandedText = await expand(text);

    editor.update(() => {
      const selection = $getSelection();

      selection?.insertRawText(`${text}${expandedText}`);
    });
  };

  const handleSummarize = async () => {
    const text = editor.getEditorState().read(() => $getSelection()?.getTextContent());

    if (!text) return;

    const summary = await summarize(text);

    editor.update(() => {
      const selection = $getSelection();

      selection?.insertRawText(summary);
    });
  };

  const applyCmd = (cmd: 'expand' | 'summarize') => {
    setSelectOpen(false);

    if (cmd === 'expand') {
      handleExpand();
    } else if (cmd === 'summarize') {
      handleSummarize();
    }

    editor.focus();
  };

  useLayoutEffect(() => {
    const onKeyDown = (e) => {
      // check if the user pressed cmd + k
      if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        setSelectOpen(true);
      }
    };

    return editor.registerRootListener(
      (rootElement: null | HTMLElement, prevRootElement: null | HTMLElement) => {
        if (prevRootElement !== null) {
          prevRootElement.removeEventListener('keydown', onKeyDown);
        }
        if (rootElement !== null) {
          rootElement.addEventListener('keydown', onKeyDown);
        }
      }
    );
  }, [editor]);

  return (
    <div style={{ height: 0, overflow: 'hidden', marginTop: '1rem' }}>
      {selectOpen ? (
        <Select
          autoFocus
          open
          style={{ width: 200 }}
          options={[
            { label: 'Summarize', value: 'summarize' },
            { label: 'Expand', value: 'expand' },
          ]}
          onBlur={() => {
            setSelectOpen(false);
          }}
          onChange={applyCmd}
        />
      ) : null}
    </div>
  );
}

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
          <CommandSPlugin />
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
