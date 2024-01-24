/* eslint-disable react/no-array-index-key */

'use client';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { List, Skeleton, Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { useParams } from 'next/navigation';

import { fetchArticlesForBrainRegionAndExperiment } from '../../api';
import ArticleListItem from './ArticleListItem';
import Header from './ExperimentLiteratureHeader';
import If from '@/components/ConditionalRenderer/If';
import { ArticleItem } from '@/api/explore-section/resources';
import { classNames } from '@/util/utils';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/experiment-types';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { articleListFiltersAtom } from '@/state/explore-section/literature-filters';

import './styles.scss';

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

export function ArticleListing() {
  const params = useParams<{ 'experiment-data-type': string }>();
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [skeletonItems, setSkeletonItems] = useState(0);
  const filters = useAtomValue(articleListFiltersAtom);
  const brainRegion = useAtomValue(selectedBrainRegionAtom)?.title;
  const experiment = Object.values(EXPERIMENT_DATA_TYPES).find(
    (exp) => exp.name === params?.['experiment-data-type'] ?? ''
  );

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

  // calculate the numver of skeleton to display based on the skeleton height
  const refListingContainer = useCallback((node: HTMLDivElement) => {
    if (node) {
      const { height } = node.getBoundingClientRect();
      // 65: page header height
      // 176: skeleton height
      setSkeletonItems(Math.round((height - 65) / 176));
    }
  }, []);

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
    if (brainRegion && experiment) {
      fetchArticlesForBrainRegionAndExperiment(
        experiment.title,
        brainRegion,
        1,
        filters,
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
    }
  }, [brainRegion, experiment, filters]);

  const loadMoreArticles = useCallback(() => {
    if (loading) {
      return;
    }

    setListingState({ loading: true });
    if (brainRegion && experiment) {
      fetchArticlesForBrainRegionAndExperiment(experiment.title, brainRegion, pageToFetch, filters)
        .then((response) => {
          setArticles((prev) => [...prev, ...response.articles]);
          setListingState({
            error: null,
            pageToFetch: response.currentPage + 1,
            hasMoreData: response.currentPage < response.pages,
          });
        })
        .catch(() => {
          setListingState({
            hasMoreData: false,
            error: new Error('There was an error while fetching more data'),
          });
        })
        .finally(() => {
          setListingState({ loading: false });
        });
    }
  }, [brainRegion, experiment, pageToFetch, filters, loading]);

  // useEffect to load initial articles when the props (brain regions or experiment name) change
  useEffect(() => {
    loadInitialArticles();
  }, [loadInitialArticles]);

  // Once the initial 50 articles are loaded and there are more articles to load, set up an intersection observer to load more articles.
  useEffect(() => {
    const target = observerTarget.current;
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        loadMoreArticles();
      }
    });

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
    <div className="flex items-start mx-10 gap-x-4 mt-12 mb-2 w-full">
      <div className="flex items-start px-4 bg-white min-w-[4rem]">
        <If id="total-count" condition={Boolean(total)}>
          <div className="text-md mt-4 text-primary-8">
            Articles:{' '}
            <div className="text-primary-8 font-bold" data-testid="total-article-count">
              {total}
            </div>
          </div>
        </If>
      </div>

      <div
        className="flex-1 max-w-7xl mx-auto h-[calc(100vh-3.5rem)] article-list-scrollbar overflow-y-auto"
        ref={refListingContainer}
      >
        <Header {...{ loading }} />
        <If id="error" condition={Boolean(error && experiment && articles.length === 0)}>
          <div
            className="self-center mx-auto border border-gray-400 p-7 whitespace-pre-line"
            data-testid="article-listing-error"
          >
            {ARTICLE_LISTING_ERRORS_MAP[(error as { cause: number })?.cause] ??
              `There was an error fetching literature data for ${experiment?.title}`}
          </div>
        </If>
        <If id="loading" condition={loading && articles.length === 0}>
          <div className="flex flex-col grow px-4 w-full" data-testid="initial data loading">
            {[...Array(skeletonItems).keys()].map((_, index) => (
              <Skeleton key={index} paragraph={{ rows: 3 }} className="my-6 px-4" />
            ))}
          </div>
        </If>
        <If id="data" condition={Boolean(articles.length)}>
          <List
            className="flex flex-col grow px-4"
            itemLayout="vertical"
            size="large"
            dataSource={articles ?? []}
            bordered={false}
            loadMore={
              <>
                {hasMoreData && (
                  <div
                    ref={observerTarget}
                    className={classNames('m-auto')}
                    data-testid="load more articles"
                  >
                    <Spin />
                  </div>
                )}
                {error && (
                  <div className="m-auto mb-2">There was an error while fetching more data</div>
                )}
              </>
            }
            renderItem={(article, index) => (
              <List.Item className="border-0! border-transparent! !border-b-0 !px-4">
                <ArticleListItem article={article} index={index} />
              </List.Item>
            )}
          />
        </If>
      </div>
    </div>
  );
}
