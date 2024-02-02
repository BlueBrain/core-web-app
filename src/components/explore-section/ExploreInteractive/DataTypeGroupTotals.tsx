'use client';

import { useAtomValue } from 'jotai';
import { LoadingOutlined, MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { loadable } from 'jotai/utils';
import { DataType } from '@/constants/explore-section/list-views';
import { DataTypeGroup } from '@/types/explore-section/data-types';
import { DATA_TYPE_GROUPS_CONFIG } from '@/constants/explore-section/data-type-groups';
import { totalByExperimentAndRegionsAtom } from '@/state/explore-section/list-view-atoms';
import { DATA_TYPES_TO_CONFIGS } from '@/constants/explore-section/data-types';

function DataTypeGroupTotal({ dataType, basePath }: { dataType: DataType; basePath: string }) {
  const brainRegionSource = 'selected';

  const total = useAtomValue(
    loadable(totalByExperimentAndRegionsAtom({ dataType, brainRegionSource }))
  );
  return (
    <>
      {total.state === 'loading' && (
        <div className="mt-14 flex w-full justify-center">
          <LoadingOutlined />
        </div>
      )}
      {total.state === 'hasError' && 'Error loading experiment datasets for brain region.'}

      {total.state === 'hasData' && (
        <Link
          href={`${basePath}${DATA_TYPES_TO_CONFIGS[dataType].name}`}
          key={DATA_TYPES_TO_CONFIGS[dataType].title}
          className="flex w-2/5 justify-between border-b-2 border-b-gray-500 py-1 hover:text-primary-4"
          data-testid={`experiment-dataset-${dataType}`}
        >
          <span className="font-light">{DATA_TYPES_TO_CONFIGS[dataType].title}</span>
          <span>
            <span className="mr-2 font-semibold">{total.data?.toLocaleString('en-US')}</span>
            <MenuOutlined />
          </span>
        </Link>
      )}
    </>
  );
}

export function DataTypeGroupTotals({ dataTypeGroup }: { dataTypeGroup: DataTypeGroup }) {
  const { config, basePath } = DATA_TYPE_GROUPS_CONFIG[dataTypeGroup];

  return (
    <div className="mb-7 flex max-h-36 flex-wrap gap-4 text-white">
      {Object.keys(config).map((dataType) => (
        <DataTypeGroupTotal key={dataType} dataType={dataType as DataType} basePath={basePath} />
      ))}
    </div>
  );
}
