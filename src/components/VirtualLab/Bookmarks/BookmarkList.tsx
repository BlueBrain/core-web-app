'use client';

import { useEffect, useMemo } from 'react';

import { InfoCircleOutlined } from '@ant-design/icons';
import { Collapse, CollapseProps, ConfigProvider } from 'antd';
import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import ExperimentBookmarks from './ExperimentBookmarks';
import { DataType } from '@/constants/explore-section/list-views';
import { bookmarksForProjectAtomFamily } from '@/state/virtual-lab/bookmark';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/data-types/experiment-data-types';

type Props = {
  labId: string;
  projectId: string;
};

export default function BookmarkList({ labId, projectId }: Props) {
  const bookmarks = useAtomValue(
    loadable(bookmarksForProjectAtomFamily({ virtualLabId: labId, projectId }))
  );
  const refreshBookmarks = useSetAtom(
    bookmarksForProjectAtomFamily({ virtualLabId: labId, projectId })
  );

  useEffect(() => {
    refreshBookmarks();
  }, [refreshBookmarks]);

  const collapsibleItems: CollapseProps['items'] = useMemo(() => {
    if (bookmarks.state !== 'hasData') {
      return [];
    }

    return Object.keys(EXPERIMENT_DATA_TYPES).map((experiment) => {
      return {
        key: experiment,
        'data-testid': `${experiment}-tab`,
        label: (
          <div>
            <span className="text-center text-xl font-bold leading-7 text-primary-8">
              {EXPERIMENT_DATA_TYPES[experiment].title}
            </span>
            <span className="ml-2 text-sm font-normal text-gray-600">
              {bookmarks.data[experiment as DataType]?.length ?? 0} pinned datasets
            </span>
          </div>
        ),
        children:
          bookmarks.data[experiment as DataType]?.length > 0 ? (
            <ExperimentBookmarks
              dataType={experiment as DataType}
              labId={labId}
              projectId={projectId}
            />
          ) : (
            <p>There are no pinned datasets for morphologies</p>
          ),
      };
    });
  }, [bookmarks, labId, projectId]);

  return (
    <div>
      <div className="mt-7 flex w-72 justify-center bg-white py-3 text-center text-xl font-bold leading-7">
        <span className="text-primary-9">Experimental data</span>{' '}
        <InfoCircleOutlined className="ml-2 text-sm text-gray-400" />
      </div>
      <div className="max-h-[1000px] w-full overflow-scroll bg-white p-10">
        <ConfigProvider
          theme={{
            components: {
              Collapse: {
                headerBg: '#ffffff',
              },
            },
            token: {
              borderRadius: 0,
            },
          }}
        >
          <Collapse
            items={collapsibleItems}
            defaultActiveKey={[DataType.ExperimentalNeuronMorphology]}
            expandIconPosition="end"
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
