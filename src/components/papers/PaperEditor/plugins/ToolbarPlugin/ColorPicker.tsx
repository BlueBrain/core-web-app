import { useCallback } from 'react';
import { ColorPicker } from 'antd';
import { Color } from 'antd/es/color-picker';
import { $getSelection, LexicalEditor } from 'lexical';
import { $patchStyleText } from '@lexical/selection';

import EditorButton from '../../../molecules/Button';
import { FormatColorBg, FormatColorText } from '@/components/icons/EditorIcons';

type Props = {
  editor: LexicalEditor;
  title: string;
  disabled?: boolean;
  color: Color;
  'aria-label'?: string;
  type: 'bg' | 'text';
};

export default function EditorColorPicker({
  editor,
  title,
  disabled = false,
  color,
  type,
  'aria-label': arialLabel,
}: Props) {
  const applyStyle = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      editor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? { tag: 'historic' } : {}
      );
    },
    [editor]
  );

  const onFontColorSelect = useCallback(
    (value: Color) => {
      applyStyle({ color: `#${value.toHex()}` });
    },
    [applyStyle]
  );

  const onBgColorSelect = useCallback(
    (value: Color) => {
      applyStyle({ 'background-color': `#${value.toHex()}` });
    },
    [applyStyle]
  );

  const onChange = (value: Color) => {
    if (type === 'text') {
      onFontColorSelect(value);
    } else if (type === 'bg') {
      onBgColorSelect(value);
    }
  };

  return (
    <ColorPicker
      trigger="click"
      disabled={disabled}
      aria-label={arialLabel}
      value={color}
      onChange={onChange}
    >
      <EditorButton title={title} icon={type === 'bg' ? <FormatColorBg /> : <FormatColorText />} />
    </ColorPicker>
  );
}
