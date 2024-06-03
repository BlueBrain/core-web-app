import { Dropdown, MenuProps } from 'antd';
import { $createCodeNode } from '@lexical/code';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';

import { $createParagraphNode, $getSelection, $isRangeSelection, LexicalEditor } from 'lexical';
import { MenuItemType } from 'antd/es/menu/hooks/useItems';

import EditorButton from '../../../molecules/Button';
import {
  FormatH1,
  FormatH2,
  FormatH3,
  FormatListBulleted,
  FormatListNumbered,
  FormatChecklist,
  FormatQuote,
  Code,
  FormatNormalText,
  FormatH6,
  FormatH5,
  FormatH4,
} from '@/components/icons/EditorIcons';

export const rootTypeToRootName = {
  root: 'Root',
  table: 'Table',
};

export const blockTypeToBlockName = {
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

const BLOCK_FORMAT_ITEMS: Array<MenuItemType> = [
  {
    key: 'paragraph',
    label: 'Paragraph',
    icon: <FormatNormalText className="h-6 w-6" />,
  },
  {
    key: 'h1',
    label: 'Heading 1',
    icon: <FormatH1 className="h-6 w-6" />,
  },
  {
    key: 'h2',
    label: 'Heading 2',
    icon: <FormatH2 className="h-6 w-6" />,
  },
  {
    key: 'h3',
    label: 'Heading 3',
    icon: <FormatH3 className="h-6 w-6" />,
  },
  {
    key: 'h4',
    label: 'Heading 4',
    icon: <FormatH4 className="h-6 w-6" />,
  },
  {
    key: 'h5',
    label: 'Heading 5',
    icon: <FormatH5 className="h-6 w-6" />,
  },
  {
    key: 'h6',
    label: 'Heading 6',
    icon: <FormatH6 className="h-6 w-6" />,
  },
  {
    key: 'bullet',
    label: 'Bullet List',
    icon: <FormatListBulleted className="h-6 w-6" />,
  },
  {
    key: 'number',
    label: 'Numbered List',
    icon: <FormatListNumbered className="h-6 w-6" />,
  },
  {
    key: 'check',
    label: 'Check List',
    icon: <FormatChecklist className="h-6 w-6" />,
  },
  {
    key: 'quote',
    label: 'Quote',
    icon: <FormatQuote className="h-6 w-6" />,
  },
  {
    key: 'code',
    label: 'Code Block',
    icon: <Code className="h-6 w-6" />,
  },
];

export default function BlockFormat({
  editor,
  blockType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  editor: LexicalEditor;
  disabled?: boolean;
}) {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection();

        if (selection !== null) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertRawText(textContent);
            }
          }
        }
      });
    }
  };

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'paragraph': {
        return formatParagraph();
      }
      case 'h1': {
        return formatHeading('h1');
      }
      case 'h2': {
        return formatHeading('h2');
      }
      case 'h3': {
        return formatHeading('h3');
      }
      case 'h4': {
        return formatHeading('h4');
      }
      case 'h5': {
        return formatHeading('h5');
      }
      case 'h6': {
        return formatHeading('h6');
      }
      case 'bullet': {
        return formatBulletList();
      }
      case 'number': {
        return formatNumberedList();
      }
      case 'check': {
        return formatCheckList();
      }
      case 'quote': {
        return formatQuote();
      }
      case 'code': {
        return formatCode();
      }
      default:
        break;
    }
  };

  return (
    <Dropdown
      disabled={disabled}
      menu={{
        selectable: true,
        selectedKeys: [blockType],
        items: BLOCK_FORMAT_ITEMS,
        onClick,
      }}
      trigger={['click']}
    >
      <EditorButton
        showLabel
        aria-label={blockTypeToBlockName[blockType]}
        title={blockTypeToBlockName[blockType]}
        disabled={disabled}
        icon={BLOCK_FORMAT_ITEMS.find((o) => o?.key === blockType)?.icon}
        label={BLOCK_FORMAT_ITEMS.find((o) => o?.key === blockType)?.label}
      />
    </Dropdown>
  );
}
