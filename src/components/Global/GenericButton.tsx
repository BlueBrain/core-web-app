import { ReactNode } from 'react';
import { Button } from 'antd';

import { classNames } from '@/util/utils';
import { basePath } from '@/config';

const defaultStyle = 'h-12 px-8 rounded-none shadow-none';

type Props = {
  text: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  loading?: boolean;
  href?: string;
  htmlType?: 'button' | 'submit';
};

export default function GenericButton({
  text,
  className = '',
  onClick = () => {},
  disabled = false,
  title = '',
  loading = false,
  href = '',
  htmlType = 'button',
}: Props) {
  const conditionalStyles = [
    className.includes('border-') ? 'border' : 'border-transparent',
    className.includes('bg-') ? '' : 'bg-transparent',
    disabled ? '!text-black !bg-slate-100 opacity-60' : '',
    className.includes('hover:') ? '' : 'hover:!text-black hover:!border-black',
    href ? 'hover:!text-white hover:!border-white leading-9' : '',
  ].join(' ');

  const getUrl = () => (href.startsWith('/') ? `${basePath}${href}` : `./${href}`);

  return (
    <Button
      className={classNames(className, conditionalStyles, defaultStyle)}
      onClick={onClick}
      title={title}
      disabled={disabled}
      loading={loading}
      type={href ? 'link' : 'default'}
      href={href ? getUrl() : undefined}
      htmlType={htmlType}
    >
      {text}
    </Button>
  );
}
