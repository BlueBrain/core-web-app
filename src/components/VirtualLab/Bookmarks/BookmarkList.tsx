'use client';

import { useEffect, useState } from 'react';

import { InfoCircleOutlined } from '@ant-design/icons';
import { Collapse, CollapseProps, ConfigProvider } from 'antd';
import { useAtomValue } from 'jotai';
import ExperimentBookmarks from './ExperimentBookmarks';
import sessionAtom from '@/state/session';
import { BookmarkItem, getBookmarkedItems } from '@/services/virtual-lab/bookmark';
import { DataType } from '@/constants/explore-section/list-views';

type Props = {
  labId: string;
  projectId: string;
};

export default function BookmarkList({ labId, projectId }: Props) {
  const [bookmarkedItems, setBookmarkedItems] = useState<BookmarkItem[]>();
  const session = useAtomValue(sessionAtom);

  useEffect(() => {
    getBookmarkedItems(labId, projectId).then((items) => {
      setBookmarkedItems(items);
      return items;
    });
  }, [labId, projectId, session?.accessToken]);

  const items: CollapseProps['items'] = bookmarkedItems
    ? [
        {
          key: '1',
          label: (
            <div>
              <span className="text-center text-xl font-bold leading-7 text-primary-8">
                Neuron morphology
              </span>
              <span className="ml-2 text-sm font-normal text-gray-600">
                {bookmarkedItems.length} pinned datasets
              </span>
            </div>
          ),
          children: (
            <ExperimentBookmarks
              dataType={DataType.ExperimentalNeuronMorphology}
              resourceIds={bookmarkedItems.map((b) => b.resourceId)}
            />
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
