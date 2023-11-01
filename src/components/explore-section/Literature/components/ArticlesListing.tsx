/* eslint-disable react/no-array-index-key */

'use client';

import { loadable } from 'jotai/utils';
import { useMemo, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';

import { ConfigProvider, List, Skeleton } from 'antd';
import ExperimentSelector from './ExperimentSelector';
import { ExperimentDetail } from '@/constants/explore-section/experiment-types';
import { getLiteratureArticlesForExperimentAndBrainRegions } from '@/state/explore-section/literature-article-list';

type Props = {
  brainRegions: string[];
  experiment: ExperimentDetail;
};

export const PAGE_SIZE = 50;

export function ArticleListing({ brainRegions, experiment }: Props) {
  const [pageOffset, setPageOffset] = useState(0);

  const previousFetchController = useRef<AbortController>();

  const totalByExperimentAndBrainRegionAtom = useMemo(() => {
    if (previousFetchController.current) {
      previousFetchController.current.abort();
    }
    const controller = new AbortController();
    previousFetchController.current = controller;

    return loadable(
      getLiteratureArticlesForExperimentAndBrainRegions(
        experiment.title,
        brainRegions,
        pageOffset,
        controller.signal
      )
    );
  }, [brainRegions, experiment, pageOffset]);
  const totalByExperimentAndBrainRegion = useAtomValue(totalByExperimentAndBrainRegionAtom);

  return (
    <div className="flex mx-10 my-12 w-full">
      <div className="flex flex-col text-gray-400">
        <ExperimentSelector currentExperiment={experiment} />

        {totalByExperimentAndBrainRegion.state === 'hasData' && (
          <div className="flex flex-col flex-wrap mb-7 h-36" data-testid="total-article-count">
            <span className="text-gray-400 text-sm mt-6">Articles</span>
            <span className="text-primary-8 font-semibold text-lg">
              {totalByExperimentAndBrainRegion.data?.total}
            </span>
          </div>
        )}
      </div>

      {totalByExperimentAndBrainRegion.state === 'loading' && (
        <div className="flex flex-col grow max-w-7xl mx-auto">
          {[...Array(50).keys()].map((_, index) => (
            <Skeleton
              key={index}
              avatar
              paragraph={{ rows: 3 }}
              title={{ width: 1000 }}
              className="my-8"
            />
          ))}
        </div>
      )}

      {totalByExperimentAndBrainRegion.state === 'hasData' && (
        <ConfigProvider
          theme={{
            token: {
              colorBorder: 'transparent',
            },
          }}
        >
          <List
            className="flex flex-col grow max-w-7xl mx-auto overflow-y-scroll"
            style={{ maxHeight: 'calc(100vh - 3rem)', scrollbarWidth: 'none' }}
            itemLayout="vertical"
            size="large"
            dataSource={totalByExperimentAndBrainRegion.data?.results ?? []}
            bordered={false}
            renderItem={(article, index) => (
              <List.Item className="border-0! border-transparent!" style={{ borderBottom: 'none' }}>
                <span className="bg-gray-100 text-sm leading-6 text-primary-8 py-2 pl-3 pr-8 mb-2">
                  Article {index + 1}
                </span>
                <h4 className="mt-3 mb-4 text-primary-8 leading-7 font-bold text-xl">
                  {article.title}
                </h4>
                <p className="text-base text-primary-8 border border-primary-2 p-7">
                  {article.abstract}
                </p>
              </List.Item>
            )}
            pagination={{
              position: 'bottom',
              align: 'end',
              size: 'small',
              defaultPageSize: PAGE_SIZE,
              pageSizeOptions: [PAGE_SIZE],
              total: totalByExperimentAndBrainRegion.data?.total ?? 0,
              onChange: (page: number) => setPageOffset((page - 1) * PAGE_SIZE),
            }}
          />
        </ConfigProvider>
      )}
    </div>
  );
}
