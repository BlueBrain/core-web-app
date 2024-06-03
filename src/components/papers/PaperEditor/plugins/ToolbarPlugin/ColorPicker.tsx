import { ColorPicker } from 'antd';
import { Color } from 'antd/es/color-picker';
import EditorButton from '../../molecules/Button';
import { FormatColorBg, FormatColorText } from '@/components/icons/EditorIcons';

type Props = {
  title: string;
  disabled?: boolean;
  color: Color;
  onChange?: (color: Color) => void;
  'aria-label'?: string;
  type: 'bg' | 'text';
};

export default function EditorColorPicker({
  title,
  disabled = false,
  color,
  onChange,
  type,
  'aria-label': arialLabel,
}: Props) {
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
