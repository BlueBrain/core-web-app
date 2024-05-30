'use client';

import { useEffect } from 'react';

import { InfoCircleOutlined } from '@ant-design/icons';
import { Collapse, CollapseProps, ConfigProvider } from 'antd';
import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import ExperimentBookmarks from './ExperimentBookmarks';
import { DataType } from '@/constants/explore-section/list-views';
import { bookmarksForProjectAtomFamily } from '@/state/virtual-lab/bookmark';

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

  const items: CollapseProps['items'] =
    bookmarks.state === 'hasData'
      ? [
          {
            key: '1',
            label: (
              <div>
                <span className="text-center text-xl font-bold leading-7 text-primary-8">
                  Neuron morphology
                </span>
                <span className="ml-2 text-sm font-normal text-gray-600">
                  {bookmarks.data.length} pinned datasets
                </span>
              </div>
            ),
            children:
              bookmarks.data.length > 0 ? (
                <ExperimentBookmarks
                  dataType={DataType.ExperimentalNeuronMorphology}
                  labId={labId}
                  projectId={projectId}
                />
              ) : (
                <p>There are no pinned datasets for morphologies</p>
              ),
          },
        ]
      : [];

  return (
    <div>
      <div className="mt-7 flex w-72 justify-center bg-white py-3 text-center text-xl font-bold leading-7">
        <span className="text-primary-9">Experimental data</span>{' '}
        <InfoCircleOutlined className="ml-2 text-sm text-gray-400" />
      </div>
      <div className="w-full bg-white p-10">
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
          <Collapse items={items} defaultActiveKey={['1']} expandIconPosition="end" />
        </ConfigProvider>
      </div>
    </div>
  );
}
