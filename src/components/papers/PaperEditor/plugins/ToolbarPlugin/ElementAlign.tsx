import { Dropdown, MenuProps } from 'antd';
import {
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  LexicalEditor,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical';
import { MenuItemType } from 'antd/es/menu/hooks/useItems';

import EditorButton from '../../molecules/Button';
import {
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignRight,
  FormatAlignLeft,
  FormatIndentDecrease,
  FormatIndentIncrease,
} from '@/components/icons/EditorIcons';

const ELEMENT_ALIGN_ITEMS: Array<MenuItemType> = [
  {
    key: 'left',
    label: 'Left Align',
    icon: <FormatAlignLeft className="h-6 w-6" />,
  },
  {
    key: 'center',
    label: 'Center Align',
    icon: <FormatAlignCenter className="h-6 w-6" />,
  },
  {
    key: 'right',
    label: 'Right Align',
    icon: <FormatAlignRight className="h-6 w-6" />,
  },
  {
    key: 'justify',
    label: 'Justify Align',
    icon: <FormatAlignJustify className="h-6 w-6" />,
  },
  {
    key: 'start',
    label: 'Start Align',
    icon: <FormatAlignLeft className="h-6 w-6" />,
  },
  {
    key: 'end',
    label: 'End Align',
    icon: <FormatAlignRight className="h-6 w-6" />,
  },
  {
    key: 'outdent',
    label: 'Outdent',
    icon: <FormatIndentDecrease className="h-6 w-6" />,
  },
  {
    key: 'indent',
    label: 'Indent',
    icon: <FormatIndentIncrease className="h-6 w-6" />,
  },
];

export default function ElementAlign({
  editor,
  value = 'left',
  disabled = false,
}: {
  editor: LexicalEditor;
  value: ElementFormatType;
  disabled: boolean;
}) {
  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'left': {
        return editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
      }
      case 'center': {
        return editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
      }
      case 'right': {
        return editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
      }
      case 'justify': {
        return editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
      }
      case 'start': {
        return editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'start');
      }
      case 'end': {
        return editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'end');
      }
      case 'outdent': {
        return editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
      }
      case 'indent': {
        return editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
      }
      default:
        break;
    }
  };

  return (
    <Dropdown
      disabled={disabled}
      menu={{
        items: ELEMENT_ALIGN_ITEMS,
        onClick,
      }}
      trigger={['click']}
      placement="bottomLeft"
    >
      <EditorButton
        showLabel
        disabled={disabled}
        aria-label="Formatting options for additional text styles"
        title="Styles"
        icon={ELEMENT_ALIGN_ITEMS.find((o) => o?.key === value)?.icon ?? <FormatAlignLeft />}
        label={ELEMENT_ALIGN_ITEMS.find((o) => o?.key === value)?.label}
      />
    </Dropdown>
  );
}
