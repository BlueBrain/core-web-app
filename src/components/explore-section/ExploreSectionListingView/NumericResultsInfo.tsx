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
    <div className="flex justify-start w-full">
      <div
        className="text-primary-9 flex items-center gap-1"
        role="status"
        aria-label="listing-view-title"
      >
        <span>Results </span>
        {total.state === 'loading' && (
          <Skeleton.Button
            active
            size="default"
            shape="square"
            className="!min-w-[2.7rem] !max-w-[2.7rem] !max-h-[1.74rem]"
          />
        )}
        {total.state === 'hasData' && <strong>{total.data?.toLocaleString('en-US')}</strong>}
      </div>
    </div>
  );
}

export default NumericResultsInfo;
