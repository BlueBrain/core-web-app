import { useCallback } from 'react';
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import { $isTableSelection } from '@lexical/table';
import { $getNearestBlockElementAncestorOrThrow } from '@lexical/utils';
import { Dropdown, MenuProps } from 'antd';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  TextFormatType,
} from 'lexical';
import { MenuItemType } from 'antd/es/menu/hooks/useItems';

import EditorButton from '../../../molecules/Button';
import {
  FormatStrikethrough,
  FormatSuperscript,
  FormatSubscript,
  DeleteOutline,
  FormatMatchCase,
} from '@/components/icons/EditorIcons';

export default function TextFormat({
  editor,
  isStrikethrough,
  isSubscript,
  isSuperscript,
  disabled = false,
}: {
  editor: LexicalEditor;
  disabled?: boolean;
  isStrikethrough: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
}) {
  const formatText = (formatType: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
  };

  const clearFormatting = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) || $isTableSelection(selection)) {
        const { anchor, focus } = selection;
        const nodes = selection.getNodes();
        const extractedNodes = selection.extract();

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            // Use a separate variable to ensure TS does not lose the refinement
            let textNode = node;
            if (idx === 0 && anchor.offset !== 0) {
              textNode = textNode.splitText(anchor.offset)[1] || textNode;
            }
            if (idx === nodes.length - 1) {
              textNode = textNode.splitText(focus.offset)[0] || textNode;
            }
            /**
             * If the selected text has one format applied
             * selecting a portion of the text, could
             * clear the format to the wrong portion of the text.
             *
             * The cleared text is based on the length of the selected text.
             */
            // We need this in case the selected text only has one format
            const extractedTextNode = extractedNodes[0];
            if (nodes.length === 1 && $isTextNode(extractedTextNode)) {
              textNode = extractedTextNode;
            }

            if (textNode.__style !== '') {
              textNode.setStyle('');
            }
            if (textNode.__format !== 0) {
              textNode.setFormat(0);
              $getNearestBlockElementAncestorOrThrow(textNode).setFormat('');
            }
            // eslint-disable-next-line no-param-reassign
            node = textNode;
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true);
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat('');
          }
        });
      }
    });
  }, [editor]);

  const items: Array<MenuItemType> = [
    {
      key: 'strikethrough',
      label: 'Strikethrough',
      icon: <FormatStrikethrough className="h-6 w-6" />,
    },
    {
      key: 'subscript',
      label: 'Subscript',
      icon: <FormatSubscript className="h-6 w-6" />,
    },
    {
      key: 'superscript',
      label: 'Superscript',
      icon: <FormatSuperscript className="h-6 w-6" />,
    },
    {
      key: 'clear',
      label: 'Clear Formatting',
      icon: <DeleteOutline className="h-6 w-6" />,
    },
  ];

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'strikethrough':
        return formatText('strikethrough');
      case 'subscript':
        return formatText('subscript');
      case 'superscript':
        return formatText('superscript');
      case 'clear':
        return clearFormatting();
      default:
        break;
    }
  };

  return (
    <Dropdown
      disabled={disabled}
      menu={{
        items,
        onClick,
        selectedKeys: [
          isStrikethrough ? 'strikethrough' : '',
          isSubscript ? 'subscript' : '',
          isSuperscript ? 'superscript' : '',
        ].filter((o) => o.length),
      }}
      trigger={['click']}
      placement="bottomRight"
    >
      <EditorButton
        disabled={disabled}
        aria-label="Format text with a strikethrough"
        title="Strikethrough"
        icon={<FormatMatchCase />}
      />
    </Dropdown>
  );
}
