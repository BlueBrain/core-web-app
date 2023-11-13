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
        'flex gap-2 items-center justify-between font-bold px-7 py-4 rounded-none text-white',
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
        'cursor-pointer flex gap-2 items-center justify-between font-bold px-7 py-4 rounded-none text-white',
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
