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
          <div className={`w-full h-px my-6 bg-zinc-300 ${showExtraDetails ? '' : 'hidden'}`} />
          {showExtraDetails && (
            <div className="w-full">
              <div className="inline-flex items-center justify-between w-full gap-y-3">
                <div className="flex items-center w-full">
                  <button
                    type="button"
                    onClick={onExpandArticles}
                    className="h-11 w-[300px] px-3 py-3 gap-1.5 bg-blue-50 text-white shadow-sm  rounded-md relative inline-flex justify-between items-center whitespace-nowrap cursor-pointer no-underline leading-tight transition-all duration-200"
                    aria-controls="collapse-content"
                    aria-label="expand-articles"
                  >
                    <div className="inline-flex items-center justify-start gap-1">
                      <div className="text-base font-normal leading-snug text-blue-900">
                        Based on
                      </div>
                      <div className="px-1 py-[.2px] bg-blue-900 rounded-[3px] flex-col justify-start items-center inline-flex">
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
                        'text-primary-8 fill-current',
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
                  className="flex items-center gap-2 px-2 py-1 cursor-pointer"
                  onClick={selectQuestion}
                >
                  <span className="text-base text-primary-8">Filter</span>
                  <span className="px-2 py-1 bg-gray-200 rounded-sm hover:bg-primary-8 group">
                    <FilterOutlined className="text-primary-8 group-hover:text-white" />
                  </span>
                </button>
              </div>
              {expandArticles && (
                <div className="mt-5 block px-1 opacity-100 transition-all ease-out-expo duration-300 overflow-hidden">
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
