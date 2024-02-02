import { HTMLProps } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { classNames } from '@/util/utils';

export function Btn({
  children,
  className,
  loading,
  onClick,
  ariaLabel,
}: HTMLProps<HTMLButtonElement> & { loading?: boolean; ariaLabel?: string }) {
  return (
    <button
      className={classNames(
        'flex items-center justify-between gap-2 rounded-none px-7 py-4 font-bold text-white',
        className
      )}
      onClick={onClick}
      type="button"
      aria-label={ariaLabel}
    >
      {children}
      {loading && (
        <Spin indicator={<LoadingOutlined style={{ color: '#fff', fontSize: 24 }} spin />} />
      )}
    </button>
  );
}

export function FileInputBtn({
  accept,
  children,
  htmlFor = 'upload',
  className,
  loading,
  onChange,
}: HTMLProps<HTMLInputElement> & { loading?: boolean }) {
  return (
    <label
      className={classNames(
        'flex cursor-pointer items-center justify-between gap-2 rounded-none px-7 py-4 font-bold text-white',
        className
      )}
      htmlFor={htmlFor}
    >
      <input className="sr-only" type="file" id="upload" accept={accept} onChange={onChange} />
      {children}
      {loading && (
        <Spin indicator={<LoadingOutlined style={{ color: '#fff', fontSize: 24 }} spin />} />
      )}
    </label>
  );
}
