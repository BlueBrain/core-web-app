'use client';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer, InitialConfigType } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import ToolbarPlugin from './plugins/ToolbarPlugin';
// import RemoteStorePlugin from './plugins/RemoteStorePlugin';
// import CommandsPlugin from './plugins/CommandsPlugin';
import InsertPlugin from './plugins/InsertPlugin';
import ActionPlugin from './plugins/ActionPlugin';
import theme from './themes/appEditorCustomTheme';

const initialConfig: InitialConfigType = {
  theme,
  onError,
  namespace: 'paper',
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    HorizontalRuleNode,
  ],
};

function onError(error: Error) {
  throw error;
}

// interface EditorProps {
//   virtualLabId: string;
//   projectId: string;
//   paperId: string;
// }

function PaperEditorContentEditable() {
  return (
    <ContentEditable
      id="paper-editor__content_editable"
      className="relative z-0 w-full flex-grow bg-white p-8 text-gray-950 focus-visible:outline-0"
    />
  );
}

function PaperEditorPlaceholder() {
  return (
    <div
      id="paper-editor__placeholder"
      className="pointer-events-none absolute inset-x-8 top-[5.5rem] inline-block select-none overflow-hidden text-ellipsis whitespace-nowrap pl-1 text-base text-gray-400"
    >
      Enter your paper details here...
    </div>
  );
}

export default function Editor() {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative flex flex-grow flex-col border border-t-0 border-gray-200">
        {/* <RemoteStorePlugin virtualLabId={virtualLabId} projectId={projectId} paperId={paperId} /> */}
        {/* <CommandsPlugin /> */}
        <CheckListPlugin />
        <ClearEditorPlugin />
        <HorizontalRulePlugin />
        <ListPlugin />
        <TabIndentationPlugin />
        <TablePlugin />
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={<PaperEditorContentEditable />}
          placeholder={<PaperEditorPlaceholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <InsertPlugin />
        <ActionPlugin />
      </div>
    </LexicalComposer>
  );
}
