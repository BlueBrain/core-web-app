/* eslint-disable react/no-array-index-key */

'use client';

import { loadable } from 'jotai/utils';
import { useMemo, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { ConfigProvider, List, Skeleton } from 'antd';
import ExperimentSelector from './ExperimentSelector';
import ArticleListItem from './ArticleListItem';
import { ExperimentConfig } from '@/constants/explore-section/experiment-types';
import { getLiteratureArticlesForExperimentAndBrainRegions } from '@/state/explore-section/literature-article-list';

type Props = {
  brainRegions: string[];
  experiment: ExperimentConfig;
};

export function ArticleListing({ brainRegions, experiment }: Props) {
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
        controller.signal
      )
    );
  }, [brainRegions, experiment]);

  const totalByExperimentAndBrainRegion = useAtomValue(totalByExperimentAndBrainRegionAtom);

  return (
    <div className="flex mx-10 mt-12 w-full">
      <div className="flex flex-col text-gray-400">
        <ExperimentSelector currentExperiment={experiment} />

        {totalByExperimentAndBrainRegion.state === 'hasData' && (
          <div className="flex flex-col flex-wrap mb-7 h-36" data-testid="total-article-count">
            <span className="text-gray-400 text-sm mt-6">Articles</span>
            <span className="text-primary-8 font-semibold text-lg">
              {totalByExperimentAndBrainRegion.data?.length}
            </span>
          </div>
        )}
      </div>

      {totalByExperimentAndBrainRegion.state === 'hasError' && (
        <div className="self-center mx-auto border border-gray-400 p-7">
          There was an error fetching literature data for {experiment.title}
        </div>
      )}

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
            style={{ maxHeight: 'calc(100vh - 3rem)' }}
            itemLayout="vertical"
            size="large"
            dataSource={totalByExperimentAndBrainRegion.data ?? []}
            bordered={false}
            renderItem={(article, index) => (
              <List.Item className="border-0! border-transparent!" style={{ borderBottom: 'none' }}>
                <ArticleListItem article={article} index={index} />
              </List.Item>
            )}
          />
        </ConfigProvider>
      )}
    </div>
  );
}
