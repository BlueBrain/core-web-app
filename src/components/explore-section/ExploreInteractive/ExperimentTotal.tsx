'use client';

import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { LoadingOutlined, MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { totalByExperimentAndRegionsAtom } from '@/state/explore-section/list-view-atoms';
import { EXPERIMENT_DATA_TYPES_NO_SC } from '@/constants/explore-section/experiment-types';
import { ExperimentDataTypeName } from '@/constants/explore-section/list-views';

type Props = {
  experimentTypeName: ExperimentDataTypeName;
};

function ExperimentTotal({ experimentTypeName }: Props) {
  const brainRegionSource = 'data';

  const total = useAtomValue(
    loadable(totalByExperimentAndRegionsAtom({ experimentTypeName, brainRegionSource }))
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
          href={`/explore/interactive/data/${EXPERIMENT_DATA_TYPES_NO_SC[experimentTypeName].name}`}
          key={EXPERIMENT_DATA_TYPES_NO_SC[experimentTypeName].title}
          className="border-b-2 border-b-gray-500 flex justify-between py-1 w-2/5 hover:text-primary-4"
          data-testid={`experiment-dataset-${experimentTypeName}`}
        >
          <span className="font-light">
            {EXPERIMENT_DATA_TYPES_NO_SC[experimentTypeName].title}
          </span>
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
