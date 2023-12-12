import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { totalAtom } from '@/state/explore-section/list-view-atoms';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';

function NumericResultsInfo({
  experimentTypeName,
  brainRegionSource,
}: {
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
      <h1 className="text-primary-9 flex" aria-label="listing-view-title">
        <span aria-label="listing-view-total">
          {total || total === 0 ? (
            total?.toLocaleString('en-US')
          ) : (
            <Spin className="ml-3" indicator={<LoadingOutlined />} />
          )}{' '}
          matching your filter selection
          <span className="font-thin text-slate-400" aria-label="listing-view-total">
            {' '}
            (out of 4500 in active brain region)
          </span>
        </span>
      </h1>
    </div>
  );
}

export default NumericResultsInfo;
