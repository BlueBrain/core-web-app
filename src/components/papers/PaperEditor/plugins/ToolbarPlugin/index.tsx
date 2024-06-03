import { useCallback, useEffect, useState } from 'react';
import { Divider } from 'antd';
import { Color } from 'antd/es/color-picker';
import { $isLinkNode } from '@lexical/link';
import { $isListNode, ListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isHeadingNode } from '@lexical/rich-text';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { $isTableSelection } from '@lexical/table';
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  ElementFormatType,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';

import { getSelectedNode } from '../../utils/getSelectedNode';
import {
  EDITOR_AUTO_SAVE_FAILED_EVENT,
  EDITOR_AUTO_SAVE_SUCCESS_EVENT,
  EDITOR_AUTO_SAVING_START_EVENT,
} from '../RemoteSyncPlugin';
import FontSize from './FontSize';
import GeneralFormat from './GeneralFormat';
import TextFormat from './TextFormat';
import ElementAlign from './ElementAlign';
import BlockFormat, { blockTypeToBlockName } from './BlockFormat';
import ColorPicker from './ColorPicker';
import HistoryControl from './HistoryControl';
import { classNames } from '@/util/utils';
import { DataSync, DataSyncInit } from '@/components/icons/EditorIcons';

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph');

  const [fontSize, setFontSize] = useState<string>('15px');
  const [fontColor, setFontColor] = useState<string>('#000');
  const [bgColor, setBgColor] = useState<string>('#fff');
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [showAutoSavedFlush, setShowAutoSavedFlush] = useState<{
    show: boolean;
    state: 'saved to storage' | 'saving' | 'error' | null;
  }>({
    show: false,
    state: null,
  });

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();

      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));

      const node = getSelectedNode(selection);
      const parent = node.getParent();

      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();

          setBlockType(type);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();

          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
        }
      }

      setFontColor($getSelectionStyleValueForProperty(selection, 'color', '#000'));
      setBgColor($getSelectionStyleValueForProperty(selection, 'background-color', '#fff'));

      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        );
      }

      let formatType: ElementFormatType = 'left';
      if ($isElementNode(matchingParent)) {
        formatType = matchingParent.getFormatType();
      } else if ($isElementNode(node)) {
        formatType = node.getFormatType();
      } else if (parent) {
        formatType = parent.getFormatType();
      }

      setElementFormat(formatType);
    }
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      setFontSize(
        $getSelectionStyleValueForProperty(selection as RangeSelection, 'font-size', '15px')
      );
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [$updateToolbar, activeEditor, editor]);

  useEffect(() => {
    const displayAutoSavedNotif = () => {
      setShowAutoSavedFlush({ show: true, state: 'saved to storage' });
      setTimeout(() => setShowAutoSavedFlush({ show: false, state: null }), 4000);
    };
    const displaySavingNotif = () => {
      setShowAutoSavedFlush({ show: true, state: 'saving' });
    };
    const hideErrorNotif = () => {
      setShowAutoSavedFlush({ show: false, state: 'error' });
    };

    window.addEventListener(EDITOR_AUTO_SAVE_SUCCESS_EVENT, displayAutoSavedNotif);
    window.addEventListener(EDITOR_AUTO_SAVING_START_EVENT, displaySavingNotif);
    window.addEventListener(EDITOR_AUTO_SAVE_FAILED_EVENT, hideErrorNotif);

    return () => {
      window.removeEventListener(EDITOR_AUTO_SAVE_SUCCESS_EVENT, displayAutoSavedNotif);
      window.removeEventListener(EDITOR_AUTO_SAVING_START_EVENT, displaySavingNotif);
      window.removeEventListener(EDITOR_AUTO_SAVE_FAILED_EVENT, hideErrorNotif);
    };
  }, []);

  return (
    <div
      className={classNames(
        'sticky top-px z-10 flex h-14 min-h-14 items-center justify-between gap-1 overflow-auto rounded-none px-3 align-middle',
        'border-y border-gray-200 bg-white text-gray-600'
      )}
    >
      <div className="flex h-full items-center justify-center gap-1">
        <HistoryControl
          {...{
            canUndo,
            canRedo,
          }}
          disabled={!isEditable}
          editor={activeEditor}
        />
        <Divider type="vertical" className="h-full" />
        <BlockFormat disabled={!isEditable} blockType={blockType} editor={editor} />
        <Divider type="vertical" className="h-full" />
        {showAutoSavedFlush.show && (
          <div className="flex select-none items-center justify-center gap-2 rounded-full px-2 py-px pr-3">
            {showAutoSavedFlush.state === 'saving' ? (
              <DataSyncInit className="h-5 w-5 text-gray-500" />
            ) : (
              <DataSync className="h-5 w-5 text-primary-9" />
            )}
            <span className="text-sm font-light text-gray-500">{showAutoSavedFlush.state}</span>
          </div>
        )}
      </div>
      <div className="flex h-full items-center justify-center gap-2">
        <Divider type="vertical" className="h-full" />
        <FontSize
          selectionFontSize={fontSize.slice(0, -2)}
          editor={activeEditor}
          disabled={!isEditable}
        />
        <Divider type="vertical" className="h-full" />
        <GeneralFormat
          {...{
            isBold,
            isCode,
            isItalic,
            isLink,
            isUnderline,
            editor: activeEditor,
            disabled: !isEditable,
          }}
        />
        <ColorPicker
          editor={activeEditor}
          type="text"
          title="text color"
          disabled={!isEditable}
          color={fontColor as unknown as Color}
        />
        <ColorPicker
          editor={activeEditor}
          type="bg"
          title="bg color"
          disabled={!isEditable}
          color={bgColor as unknown as Color}
        />
        <Divider type="vertical" className="h-full" />
        <TextFormat
          disabled={!isEditable}
          editor={activeEditor}
          {...{
            isStrikethrough,
            isSubscript,
            isSuperscript,
          }}
        />
        <Divider type="vertical" className="h-full" />
        <ElementAlign disabled={!isEditable} value={elementFormat} editor={activeEditor} />
      </div>
    </div>
  );
}
