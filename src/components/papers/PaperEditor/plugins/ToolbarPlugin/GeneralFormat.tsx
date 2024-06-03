import { IS_APPLE } from '@lexical/utils';
import { FORMAT_TEXT_COMMAND, LexicalEditor } from 'lexical';
import React from 'react';
import EditorButton from '../../molecules/Button';
import { Code, FormatBold, FormatItalic, FormatUnderlined } from '@/components/icons/EditorIcons';

export default function GeneralFormat({
  editor,
  disabled = false,
  isBold,
  isItalic,
  isUnderline,
  isCode,
}: {
  editor: LexicalEditor;
  disabled?: boolean;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isCode: boolean;
}) {
  return (
    <div className="flex gap-2">
      <EditorButton
        disabled={disabled}
        aria-label={`Format text as bold. Shortcut: ${IS_APPLE ? '⌘B' : 'Ctrl+B'}`}
        title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        icon={<FormatBold />}
        active={isBold}
      />
      <EditorButton
        disabled={disabled}
        aria-label={`Format text as italics. Shortcut: ${IS_APPLE ? '⌘I' : 'Ctrl+I'}`}
        title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        icon={<FormatItalic />}
        active={isItalic}
      />
      <EditorButton
        disabled={disabled}
        aria-label={`Format text to underlined. Shortcut: ${IS_APPLE ? '⌘U' : 'Ctrl+U'}`}
        title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        icon={<FormatUnderlined />}
        active={isUnderline}
      />
      <EditorButton
        disabled={disabled}
        aria-label="Insert code block"
        title="Insert code block"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
        }}
        icon={<Code />}
        active={isCode}
      />
    </div>
  );
}
