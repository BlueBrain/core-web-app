import { IS_APPLE } from '@lexical/utils';
import { LexicalEditor, REDO_COMMAND, UNDO_COMMAND } from 'lexical';
import React from 'react';
import EditorButton from '../../molecules/Button';
import { Redo, Undo } from '@/components/icons/EditorIcons';

type Props = {
  disabled: boolean;
  canUndo: boolean;
  canRedo: boolean;
  editor: LexicalEditor;
};

function HistoryControl({ disabled, editor, canRedo, canUndo }: Props) {
  return (
    <>
      <EditorButton
        disabled={!canUndo || disabled}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
        aria-label="Undo"
        icon={<Undo />}
      />
      <EditorButton
        disabled={!canRedo || disabled}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? 'Redo (⌘Y)' : 'Redo (Ctrl+Y)'}
        aria-label="Redo"
        icon={<Redo />}
      />
    </>
  );
}

export default HistoryControl;
