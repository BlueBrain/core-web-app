import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import {
  totalAtom,
  totalByExperimentAndRegionsAtom,
} from '@/state/explore-section/list-view-atoms';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';
import { useLoadableValue } from '@/hooks/hooks';

function NumericResultsInfo({
  experimentTypeName,
  brainRegionSource,
}: {
  experimentTypeName: string;
  brainRegionSource: ExploreDataBrainRegionSource;
}) {
  const total = useLoadableValue(totalAtom({ experimentTypeName, brainRegionSource }));
  const totalByExperimentAndRegions = useLoadableValue(
    totalByExperimentAndRegionsAtom({ experimentTypeName, brainRegionSource })
  );

  return (
    <div className="flex justify-between w-full pl-4">
      <h1 className="text-primary-9 flex items-center" aria-label="listing-view-title">
        <span aria-label="listing-view-total">
          {total.state === 'loading' ||
            (totalByExperimentAndRegions.state === 'loading' && (
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            ))}
          {total.state === 'hasData' &&
            totalByExperimentAndRegions.state === 'hasData' &&
            total.data !== 0 &&
            totalByExperimentAndRegions.data !== 0 && (
              <>
                {`${total.data?.toLocaleString('en-US')} matching your filter selection`}
                <span className="font-thin text-slate-400" aria-label="listing-view-total">
                  {` (out of ${totalByExperimentAndRegions.data?.toLocaleString(
                    'en-US'
                  )} in active brain region)`}
                </span>
              </>
            )}
        </span>
      </h1>
    </div>
  );
}

export default NumericResultsInfo;
