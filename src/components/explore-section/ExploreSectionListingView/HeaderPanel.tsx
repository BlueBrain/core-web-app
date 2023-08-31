import { ReactNode, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { totalAtom } from '@/state/explore-section/list-view-atoms';

export default function HeaderPanel({
  children,
  loading,
  title,
  type,
}: {
  children: ReactNode;
  loading: boolean;
  title: string;
  type: string;
}) {
  const total = useAtomValue(useMemo(() => unwrap(totalAtom(type)), [type]));

  return (
    <div className="flex items-center justify-between ml-5">
      <div className="text-primary-7 text-2xl font-bold flex-auto w-6/12">
        <h1 className="flex items-baseline">
          {title}
          <small className="flex gap-1 text-sm whitespace-pre font-thin text-slate-400 pl-2">
            <span>Total:</span>
            <span>
              {!loading ? (
                total?.toLocaleString('en-US')
              ) : (
                <Spin className="ml-3" indicator={<LoadingOutlined />} />
              )}
            </span>
          </small>
        </h1>
      </div>
      {children}
    </div>
  );
}
