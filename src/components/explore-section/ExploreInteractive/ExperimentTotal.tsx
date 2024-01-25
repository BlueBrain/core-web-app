'use client';

import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { LoadingOutlined, MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { totalByExperimentAndRegionsAtom } from '@/state/explore-section/list-view-atoms';
import { DataType } from '@/constants/explore-section/list-views';
import { DATA_TYPES_TO_CONFIGS } from '@/constants/explore-section/data-types';

type Props = {
  dataType: DataType;
};

function ExperimentTotal({ dataType }: Props) {
  const brainRegionSource = 'selected';

  const total = useAtomValue(
    loadable(totalByExperimentAndRegionsAtom({ dataType, brainRegionSource }))
  );
  return (
    <>
      {total.state === 'loading' && (
        <div className="w-full flex justify-center mt-14">
          <LoadingOutlined />
        </div>
      )}
      {total.state === 'hasError' && 'Error loading experiment datasets for brain region.'}

      {total.state === 'hasData' && (
        <Link
          href={`/explore/interactive/data/${DATA_TYPES_TO_CONFIGS[dataType].name}`}
          key={DATA_TYPES_TO_CONFIGS[dataType].title}
          className="border-b-2 border-b-gray-500 flex justify-between py-1 w-2/5 hover:text-primary-4"
          data-testid={`experiment-dataset-${dataType}`}
        >
          <span className="font-light">{DATA_TYPES_TO_CONFIGS[dataType].title}</span>
          <span>
            <span className="font-semibold mr-2">{total.data?.toLocaleString('en-US')}</span>
            <MenuOutlined />
          </span>
        </Link>
      )}
    </>
  );
}

export default ExperimentTotal;
