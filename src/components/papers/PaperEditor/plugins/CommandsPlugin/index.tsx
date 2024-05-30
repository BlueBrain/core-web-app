import { useState, useLayoutEffect } from 'react';
import { Select } from 'antd';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection } from 'lexical';
import { expand, summarize } from '../../services/ml';

export default function CommandsPlugin() {
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
    const onKeyDown = (e: KeyboardEvent) => {
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
