'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { useAtomValue } from 'jotai';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Collapse, CollapseProps, ConfigProvider } from 'antd';
import { getBookmarkedItems, BookmarkItem } from '@/services/virtual-lab/bookmark';
import { detailUrlWithinLab } from '@/util/common';
import { fetchESResourceByIds } from '@/api/explore-section/resources';
import { esQueryById } from '@/queries/explore-section/data';
import sessionAtom from '@/state/session';

type Props = {
  labId: string;
  projectId: string;
};

export default function BookmarkList({ labId, projectId }: Props) {
  const [bookmarkedItems, setBookmarkedItems] = useState<BookmarkItem[]>();
  const session = useAtomValue(sessionAtom);

  useEffect(() => {
    getBookmarkedItems(labId, projectId)
      .then((items) => {
        setBookmarkedItems(items);
        return items;
      })
      .then((bookmarks) => {
        fetchESResourceByIds(
          session?.accessToken!,
          esQueryById(bookmarks.map((b) => b.resourceId))
        );
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
            <ul>
              {bookmarkedItems.map((bookmark) => (
                <li key={bookmark.resourceId}>
                  <Link
                    href={detailUrlWithinLab(
                      labId,
                      projectId,
                      bookmark.projectLabel,
                      bookmark.resourceId,
                      'morphology'
                    )}
                  >
                    {' '}
                    {bookmark.resourceId}
                  </Link>
                </li>
              ))}
            </ul>
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
      <div className="bg-white p-10">
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
