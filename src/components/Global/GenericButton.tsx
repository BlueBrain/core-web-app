import { ReactNode } from 'react';
import { Button } from 'antd';

import { classNames } from '@/util/utils';

const defaultStyle = 'h-12 px-8 rounded-none shadow-none';

type Props = {
  text: string | ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
};

export default function GenericButton({
  text,
  className = '',
  onClick = () => {},
  disabled = false,
  title = '',
}: Props) {
  const conditionalStyles = [
    className.includes('border-') ? 'border' : 'border-transparent',
    className.includes('bg-') ? '' : 'bg-transparent',
    disabled ? '!text-black !bg-slate-100 opacity-60' : '',
    className.includes('hover:') ? '' : 'hover:!text-black hover:!border-black',
  ].join(' ');

  return (
    <Button
      className={classNames(className, conditionalStyles, defaultStyle)}
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {text}
    </Button>
  );
}
