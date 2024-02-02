import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { FilterOutlined } from '@ant-design/icons';

import ArticleSorter from '../ArticleSorter';
import ArticlesTimeLine from '../ArticlesTimeLine';
import { FilterFns } from '../FilterPanel';
import ResultHeader from './ResultHeader';

import ResultContainer from './ResultContainer';
import { FilterFieldsType, SortFn, SucceededGenerativeQA } from '@/types/literature';
import { literatureAtom, useLiteratureAtom } from '@/state/literature';
import { ChevronIcon } from '@/components/icons';
import { classNames } from '@/util/utils';

export type ResultSuccessProps = Omit<
  SucceededGenerativeQA,
  'sources' | 'paragraphs' | 'isNotFound' | 'answer'
> & {
  children: React.ReactNode;
};

export default function ResultSuccess({
  id,
  question,
  askedAt,
  brainRegion,
  articles,
  streamed,
  children,
}: ResultSuccessProps) {
  const [expandArticles, setExpandArticles] = useState(false);
  const [collpaseQuestion, setCollpaseQuestion] = useState(false);
  const [sortFunction, setSortFunction] = useState<SortFn | null>(null);
  const updateLiterature = useLiteratureAtom();
  const { filterValues, selectedQuestionForFilter } = useAtomValue(literatureAtom);

  const onExpandArticles = () => setExpandArticles((prev) => !prev);
  const toggleCollapseQuestion = () => setCollpaseQuestion((state) => !state);

  const filteredArticles =
    filterValues && selectedQuestionForFilter === id
      ? articles.filter((article) =>
          Object.entries(filterValues).every(([filterField, filterValue]) =>
            FilterFns[filterField as FilterFieldsType](article, filterValue)
          )
        )
      : articles;

  const displayedArticles = sortFunction
    ? [...filteredArticles].sort(sortFunction)
    : filteredArticles;

  const showExtraDetails = streamed && Boolean(articles?.length);

  const selectQuestion = () => {
    const selectingNewQuestion = selectedQuestionForFilter !== id;
    if (selectingNewQuestion) {
      updateLiterature('filterValues', null);
    }
    updateLiterature('isFilterPanelOpen', true);
    updateLiterature('selectedQuestionForFilter', id);
    setExpandArticles(true);
  };

  return (
    <ResultContainer id={id} moreSpace={collpaseQuestion || expandArticles}>
      <>
        <ResultHeader
          {...{
            question,
            askedAt,
            brainRegion,
            collpaseQuestion,
            toggleCollapseQuestion,
          }}
        />
        <div className={`${collpaseQuestion ? 'hidden' : 'block'}`}>
          {children}
          <div className={`my-6 h-px w-full bg-zinc-300 ${showExtraDetails ? '' : 'hidden'}`} />
          {showExtraDetails && (
            <div className="w-full">
              <div className="inline-flex w-full items-center justify-between gap-y-3">
                <div className="flex w-full items-center">
                  <button
                    type="button"
                    onClick={onExpandArticles}
                    className="relative inline-flex h-11 w-[300px] cursor-pointer items-center justify-between gap-1.5  whitespace-nowrap rounded-md bg-blue-50 px-3 py-3 leading-tight text-white no-underline shadow-sm transition-all duration-200"
                    aria-controls="collapse-content"
                    aria-label="expand-articles"
                  >
                    <div className="inline-flex items-center justify-start gap-1">
                      <div className="text-base font-normal leading-snug text-blue-900">
                        Based on
                      </div>
                      <div className="inline-flex flex-col items-center justify-start rounded-[3px] bg-blue-900 px-1 py-[.2px]">
                        <span className="text-sm font-bold tracking-tight text-blue-50">
                          {articles.length}
                        </span>
                      </div>
                      <div className="text-base font-normal leading-snug text-blue-900">
                        paragraphs
                      </div>
                    </div>
                    <ChevronIcon
                      className={classNames(
                        'fill-current text-primary-8',
                        expandArticles ? '-rotate-90' : 'rotate-90'
                      )}
                    />
                  </button>
                  <ArticleSorter
                    onChange={(sortFn) => {
                      setSortFunction(() => sortFn);
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-2 px-2 py-1"
                  onClick={selectQuestion}
                >
                  <span className="text-base text-primary-8">Filter</span>
                  <span className="group rounded-sm bg-gray-200 px-2 py-1 hover:bg-primary-8">
                    <FilterOutlined className="text-primary-8 group-hover:text-white" />
                  </span>
                </button>
              </div>
              {expandArticles && (
                <div className="mt-5 block overflow-hidden px-1 opacity-100 transition-all duration-300 ease-out-expo">
                  <div className="mt-4 rounded">
                    <ArticlesTimeLine
                      {...{
                        articles: displayedArticles,
                        collapseAll: expandArticles,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </>
    </ResultContainer>
  );
}
