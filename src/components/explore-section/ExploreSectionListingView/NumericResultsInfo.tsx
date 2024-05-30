import { Skeleton } from 'antd';

import { totalAtom } from '@/state/explore-section/list-view-atoms';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';
import { useLoadableValue } from '@/hooks/hooks';
import { DataType } from '@/constants/explore-section/list-views';

function NumericResultsInfo({
  dataType,
  brainRegionSource,
}: {
  dataType: DataType;
  brainRegionSource: ExploreDataBrainRegionSource;
}) {
  const total = useLoadableValue(totalAtom({ dataType, brainRegionSource }));

  return (
    <div className="flex w-full justify-start">
      <div
        className="flex items-center gap-1 text-primary-9"
        role="status"
        aria-label="listing-view-title"
      >
        <span>Results </span>
        {total.state === 'loading' && (
          <Skeleton.Button
            active
            size="default"
            shape="square"
            className="!max-h-[1.74rem] !min-w-[2.7rem] !max-w-[2.7rem]"
          />
        )}
        {total.state === 'hasData' && <strong>{total.data?.toLocaleString('en-US')}</strong>}
      </div>
    </div>
  );
}

export default NumericResultsInfo;
