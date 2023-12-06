/* eslint-disable react/no-array-index-key */

'use client';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';

import { ConfigProvider, List, Skeleton, Spin } from 'antd';
import ExperimentSelector from '../ExperimentSelector';
import { fetchArticlesForBrainRegionAndExperiment } from '../../api';
import ArticleListItem from './ArticleListItem';
import './styles.scss';
import sessionAtom from '@/state/session';
import { ArticleItem } from '@/api/explore-section/resources';
import { classNames } from '@/util/utils';
import { ExperimentConfig } from '@/constants/explore-section/experiment-types';

type Props = {
  brainRegions: string[];
  experiment: ExperimentConfig;
};

type ListingState = {
  loading: boolean;
  error: Error | null;
  pageToFetch: number;
  total: number;
  hasMoreData: boolean;
};

const ARTICLE_LISTING_ERRORS_MAP: { [key: string]: string } = {
  '1': 'No matching article was located based on the applied filters.\nKindly refine your filters and attempt the search again.\nShould the problem persist, please submit a support ticket by clicking on "Feedback" button.',
};

export const ARTICLES_PER_PAGE = 50;

export function ArticleListing({ brainRegions, experiment }: Props) {
  const session = useAtomValue(sessionAtom);
  const [articles, setArticles] = useState<ArticleItem[]>([]);

  const [{ loading, error, pageToFetch, total, hasMoreData }, setListingState] = useReducer(
    (prev: ListingState, next: Partial<ListingState>) => ({
      ...prev,
      ...next,
    }),
    {
      loading: false,
      error: null,
      pageToFetch: 1,
      total: 0,
      hasMoreData: true,
    }
  );

  const previousFetchController = useRef<AbortController>();
  const observerTarget = useRef<HTMLDivElement | null>(null);

  const cancelPreviousRequest = () => {
    if (previousFetchController.current) {
      previousFetchController.current.abort();
    }
    const controller = new AbortController();
    previousFetchController.current = controller;
    return controller;
  };

  const loadInitialArticles = useCallback(() => {
    const controller = cancelPreviousRequest();
    setArticles([]);
    setListingState({
      loading: true,
      error: null,
    });

    fetchArticlesForBrainRegionAndExperiment(
      session?.accessToken ?? '',
      experiment.title,
      brainRegions,
      1,
      controller.signal
    )
      .then((response) => {
        setArticles(response.articles);

        setListingState({
          error: null,
          total: response.total,
          pageToFetch: response.currentPage + 1,
          hasMoreData: response.currentPage < response.pages,
        });
      })
      .catch((err: Error) => {
        if (!controller.signal.aborted) {
          setListingState({
            error: err,
            hasMoreData: false,
          });
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setListingState({ loading: false });
        }
      });
  }, [brainRegions, experiment.title, session]);

  const loadMoreArticles = useCallback(() => {
    if (loading) {
      return;
    }

    setListingState({ loading: true });

    fetchArticlesForBrainRegionAndExperiment(
      session?.accessToken ?? '',
      experiment.title,
      brainRegions,
      pageToFetch
    )
      .then((response) => {
        setArticles((prev) => [...prev, ...response.articles]);
        setListingState({
          error: null,
          pageToFetch: response.currentPage + 1,
          hasMoreData: response.currentPage < response.pages,
        });
      })
      .catch(() => {
        setListingState({ hasMoreData: false });
      })
      .finally(() => {
        setListingState({ loading: true });
      });
  }, [brainRegions, experiment.title, pageToFetch, session, loading]);

  // useEffect to load initial articles when the props (brain regions or experiment name) change
  useEffect(() => {
    loadInitialArticles();
  }, [loadInitialArticles]);

  // Once the initial 50 articles are loaded and there are more articles to load, set up an intersection observer to load more articles.
  useEffect(() => {
    const target = observerTarget.current;
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting) {
          loadMoreArticles();
        }
      },
      { threshold: 1 }
    );

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [loading, loadMoreArticles]);

  return (
    <div className="flex mx-10 mt-12 w-full">
      <div className="flex flex-col text-gray-400">
        <ExperimentSelector currentExperiment={experiment} />

        {total ? (
          <div className="flex flex-col flex-wrap mb-7 h-36" data-testid="total-article-count">
            <span className="text-gray-400 text-sm mt-6">Articles</span>
            <span className="text-primary-8 font-semibold text-lg">{total}</span>
          </div>
        ) : null}
      </div>

      {error && (
        <div className="self-center mx-auto border border-gray-400 p-7 whitespace-pre-line">
          {ARTICLE_LISTING_ERRORS_MAP[(error as { cause: number }).cause] ??
            `There was an error fetching literature data for ${experiment.title}`}
        </div>
      )}

      {loading && articles.length === 0 && (
        <div className="flex flex-col grow max-w-7xl mx-auto" data-testid="initial data loading">
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

      {articles.length > 0 && (
        <ConfigProvider
          theme={{
            token: {
              colorBorder: 'transparent',
            },
          }}
        >
          <List
            className="flex flex-col grow max-w-7xl mx-auto overflow-y-auto article-list-scrollbar"
            style={{ maxHeight: 'calc(100vh - 3rem)' }}
            itemLayout="vertical"
            size="large"
            dataSource={articles ?? []}
            bordered={false}
            loadMore={
              hasMoreData && (
                <div
                  ref={observerTarget}
                  className={classNames('m-auto')}
                  data-testid="load more articles"
                >
                  <Spin />
                </div>
              )
            }
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
