import { HTMLProps } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { classNames } from '@/util/utils';

const antIcon = <LoadingOutlined style={{ float: 'left', fontSize: 24 }} spin />;

function Btn({ children, className, disabled, onClick }: HTMLProps<HTMLButtonElement>) {
  return (
    <button
      className={classNames('font-semibold mt-2 mx-auto px-14 py-4 rounded-3xl', className)}
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function LoadMoreButton({
  children,
  disabled,
  loading,
  onClick,
}: HTMLProps<HTMLButtonElement> & { loading: boolean }) {
  if (loading) {
    return (
      <Btn className="bg-primary-8 cursor-progress text-white" disabled>
        <Spin indicator={antIcon} />
      </Btn>
    );
  }

  return !disabled ? (
    <Btn className="bg-primary-8 text-white" onClick={onClick}>
      {children}
    </Btn>
  ) : (
    <Btn className="bg-neutral-2 cursor-not-allowed text-primary-9" disabled>
      {children}
    </Btn>
  );
}
