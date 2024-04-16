import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Dropdown, Space } from 'antd';
import { AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined, BoldOutlined, DownOutlined, FileImageOutlined, ItalicOutlined, LineOutlined, LinkOutlined, PlusOutlined, RedoOutlined, ScissorOutlined, StrikethroughOutlined, TableOutlined, UnderlineOutlined, UndoOutlined } from '@ant-design/icons';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import { $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isTableNode } from '@lexical/table';
import { $isListNode, ListNode } from '@lexical/list';
import { $isHeadingNode } from '@lexical/rich-text';
import { $isCodeNode } from '@lexical/code';
import {
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  NodeKey,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';

import { getSelectedNode } from '../../utils/getSelectedNode';
import IS_APPLE from '../../utils/isApple';

import style from '../../paper-editor.module.css';

const LowPriority = 1;

const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};

const rootTypeToRootName = {
  root: 'Root',
  table: 'Table',
};

export const CODE_LANGUAGE_MAP: Record<string, string> = {
  cpp: 'cpp',
  java: 'java',
  javascript: 'js',
  md: 'markdown',
  plaintext: 'plain',
  python: 'py',
  text: 'plain',
  ts: 'typescript',
};

function Divider() {
  return <div className={style.divider} />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);


  const toolbarRef = useRef(null);

  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph');
  const [rootType, setRootType] = useState<keyof typeof rootTypeToRootName>('root');
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null);

  const [fontSize, setFontSize] = useState<string>('15px');
  const [fontColor, setFontColor] = useState<string>('#000');
  const [bgColor, setBgColor] = useState<string>('#fff');
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
  const [isLink, setIsLink] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>('');

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateToolbar = useCallback(() => {
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

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType('table');
      } else {
        setRootType('root');
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : '',
            );
            return;
          }
        }
      }

      // Handle buttons
      setFontSize(
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px'),
      );
      setFontColor(
        $getSelectionStyleValueForProperty(selection, 'color', '#000'),
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          '#fff',
        ),
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'),
      );
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );
      }

      // If matchingParent is a valid node, pass it's format type
      setElementFormat(
        // eslint-disable-next-line no-nested-ternary
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType() || 'left',
      );
    }
  }, [activeEditor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),

      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),

      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? {tag: 'historic'} : {},
      );
    },
    [activeEditor],
  );

  const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({color: value}, skipHistoryStack);
    },
    [applyStyleText],
  );

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({'background-color': value}, skipHistoryStack);
    },
    [applyStyleText],
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      // setIsLinkEditMode(true);
      // editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      // setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey],
  );

  return (
    <div className={style.toolbar} ref={toolbarRef}>
      <Button
        disabled={!canUndo}
        title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        icon={<UndoOutlined />}
        aria-label="Undo"
      />

      <Button
        disabled={!canRedo}
        title={IS_APPLE ? 'Redo (⌘Y)' : 'Redo (Ctrl+Y)'}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        icon={<RedoOutlined />}
        aria-label="Redo"
      />

      <Divider />

      <Button
        title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={`${style.toolbarItem} ${style.spaced} ` + (isBold ? `${style.active}` : '')}
        aria-label="Format Bold"
        icon={<BoldOutlined />}
      />

      <Button
        title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={`${style.toolbarItem} ${style.spaced} ` + (isItalic ? `${style.active}` : '')}
        icon={<ItalicOutlined />}
        aria-label="Format Italics"
      />

      <Button
        title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={`${style.toolbarItem} ${style.spaced} ` + (isUnderline ? `${style.active}` : '')}
        icon={<UnderlineOutlined />}
        aria-label="Format Underline"
      />

      <Button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={
          `${style.toolbarItem} ${style.spaced} ` + (isStrikethrough ? `${style.active}` : '')
        }
        icon={<StrikethroughOutlined />}
        aria-label="Format Strikethrough"
      />

      <Button
        // disabled={!isEditable} // TODO Add
        onClick={insertLink}
        className={`${style.toolbarItem} ${style.spaced}` + (isLink ? 'active' : '')}
        aria-label="Insert link"
        icon={<LinkOutlined />}
        title="Insert link"
      />

      <Divider />

      <Button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className={`${style.toolbarItem} ${style.spaced}`}
        icon={<AlignLeftOutlined />}
        aria-label="Left Align"
      />

      <Button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className={`${style.toolbarItem} ${style.spaced}`}
        icon={<AlignCenterOutlined />}
        aria-label="Center Align"
      />

      <Button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className={`${style.toolbarItem} ${style.spaced}`}
        icon={<AlignRightOutlined />}
        aria-label="Right Align"
      />

      <Dropdown
        trigger={["click"]}
        menu={{
          // TODO This is to be implemented.
          items: [
            {
              label: 'Horizontal Rule',
              key: 'horizontalRule',
              icon: <LineOutlined />,
            },
            {
              label: 'Page Break',
              key: 'pageBreak',
              icon: <ScissorOutlined />,
            },
            {
              label: 'Image',
              key: 'image',
              icon:<FileImageOutlined />,
            },
            {
              label: 'Inline image',
              key: 'inlineImage',
              icon: <FileImageOutlined />,
            },
            {
              label: 'Table',
              key: 'table',
              icon: <TableOutlined />,
            },
          ],
          onClick: () => {}
        }}
      >
        <Button>
          <Space>
            <PlusOutlined />
            <span className="mx-4">Insert</span>
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </div>
  );
}
