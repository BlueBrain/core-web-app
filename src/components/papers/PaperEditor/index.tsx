'use client';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer, InitialConfigType } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { SerializedEditorState } from 'lexical/LexicalEditorState';

import InlineImageNode from './plugins/ImagePlugin/InlineImage/Node';
import GalleryNode from './plugins/GalleryPlugin/Node';
import InlineImagesPlugin from './plugins/ImagePlugin/InlineImage';
import GalleryPlugin from './plugins/GalleryPlugin';
import RemoteSyncPlugin from './plugins/RemoteSyncPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import FloatAiCommandsPlugin from './plugins/AiPlugin';
import InsertPlugin from './plugins/InsertPlugin';
import ActionPlugin from './plugins/ActionPlugin';
import theme from './themes/appEditorCustomTheme';
import { PaperResource } from '@/types/nexus';
import { isJSON } from '@/util/utils';

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
    LinkNode,
    InlineImageNode,
    GalleryNode,
  ],
};

function onError(error: Error) {
  throw error;
}

type Props = {
  paper: PaperResource;
  config: SerializedEditorState;
};

function PaperEditorContentEditable() {
  return (
    <ContentEditable
      id="paper-editor__content_editable"
      className="relative z-0 w-full flex-grow bg-white p-8 text-gray-950 focus-visible:outline-none focus-visible:outline-0"
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

export default function Editor({ config, paper }: Props) {
  return (
    <LexicalComposer
      initialConfig={{
        ...initialConfig,
        editorState: isJSON(config) ? JSON.stringify(config) : undefined,
      }}
    >
      <div
        id="paper-editor"
        className="relative flex h-[calc(100%-60px)] flex-col border border-t-0 border-gray-200 pb-40"
      >
        <RemoteSyncPlugin {...{ paper }} />
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
        <FloatAiCommandsPlugin />
        <InlineImagesPlugin />
        <GalleryPlugin />
        <InsertPlugin {...{ paper }} />
        <ActionPlugin />
      </div>
    </LexicalComposer>
  );
}
