import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { totalAtom } from '@/state/explore-section/list-view-atoms';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';

function HeaderPanel({
  title,
  experimentTypeName,
  brainRegionSource,
}: {
  title?: string;
  experimentTypeName: string;
  brainRegionSource: ExploreDataBrainRegionSource;
}) {
  const total = useAtomValue(
    useMemo(
      () => unwrap(totalAtom({ experimentTypeName, brainRegionSource })),
      [brainRegionSource, experimentTypeName]
    )
  );
  return (
    <div className="flex justify-between pl-5 w-full">
      <div className="text-primary-9 text-2xl font-bold flex-auto">
        <h1 className="flex items-baseline">
          {title}
          <small className="flex gap-1 text-sm whitespace-pre font-thin text-slate-400 pl-2">
            <span>Total:</span>
            <span>
              {total || total === 0 ? (
                total?.toLocaleString('en-US')
              ) : (
                <Spin className="ml-3" indicator={<LoadingOutlined />} />
              )}
            </span>
          </small>
        </h1>
      </div>
    </div>
  );
}

export default HeaderPanel;
