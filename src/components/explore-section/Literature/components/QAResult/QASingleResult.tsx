import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import trim from 'lodash/trim';
import { FilterOutlined } from '@ant-design/icons';

import ArticleSorter from '../ArticleSorter';
import ArticlesTimeLine from '../ArticlesTimeLine';
import { FilterFns } from '../FilterPanel';
import GenerativeQASingleResultHeader from './QASingleResultHeader';

import GenerativeQASingleResultContainer from './QASingleResultContainer';
import { FilterFieldsType, GenerativeQASingleResultProps, SortFn } from '@/types/literature';
import { literatureAtom, useLiteratureAtom } from '@/state/literature';
import { ChevronIcon } from '@/components/icons';
import { classNames } from '@/util/utils';

export default function GenerativeQASingleResult({
  id,
  question,
  askedAt,
  answer,
  rawAnswer,
  brainRegion,
  articles,
}: GenerativeQASingleResultProps) {
  const answerRef = useRef<HTMLDivElement>(null);
  const [expandArticles, setExpandArticles] = useState(false);
  const [collpaseQuestion, setCollpaseQuestion] = useState(false);
  const [sortFunction, setSortFunction] = useState<SortFn | null>(null);
  const updateLiterature = useLiteratureAtom();
  const { filterValues, selectedQuestionForFilter } = useAtomValue(literatureAtom);

  const toggleExpandArticles = () => setExpandArticles((state) => !state);
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

  const showExtraDetails = Boolean(articles.length);

  let finalAnswer = answer;
  if (answer && trim(answer).length > 0) {
    finalAnswer = answer;
  } else if (rawAnswer && trim(rawAnswer).length > 0) {
    finalAnswer = rawAnswer;
  }

  useEffect(() => {
    if (answerRef.current && expandArticles) {
      answerRef.current.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
  }, [expandArticles]);

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
    <GenerativeQASingleResultContainer id={id} moreSpace={collpaseQuestion || expandArticles}>
      <>
        <GenerativeQASingleResultHeader
          {...{
            question,
            askedAt,
            brainRegion,
            collpaseQuestion,
            toggleCollapseQuestion,
          }}
        />
        <div className={`${collpaseQuestion ? 'hidden' : 'block'}`}>
          <div className="w-full text-xl font-normal leading-7 text-blue-900">{finalAnswer}</div>
          <div className={`w-full h-px my-6 bg-zinc-300 ${showExtraDetails ? '' : 'hidden'}`} />
          <div className={`w-full ${showExtraDetails ? '' : 'hidden'}`}>
            <div className="inline-flex items-center justify-between w-full gap-y-3">
              <div className="flex items-center w-full">
                <button
                  type="button"
                  onClick={toggleExpandArticles}
                  className="h-11 w-[300px] px-3 py-3 gap-1.5 bg-blue-50 text-white shadow-sm  rounded-md relative inline-flex justify-between items-center whitespace-nowrap cursor-pointer no-underline leading-tight transition-all duration-200"
                  aria-controls="collapse-content"
                  aria-label="expand-articles"
                >
                  <div className="inline-flex items-center justify-start gap-1">
                    <div className="text-base font-normal leading-snug text-blue-900">Based on</div>
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
            <div
              id="collapse-content"
              className={`mt-5 ${
                expandArticles
                  ? 'block px-1 opacity-100 transition-all ease-out-expo duration-300 overflow-hidden'
                  : 'hidden transition-all duration-100 ease-in-expo'
              }`}
              data-collapse-animate="on"
            >
              <div className="mt-4 rounded">
                <ArticlesTimeLine
                  {...{
                    articles: displayedArticles,
                    collapseAll: expandArticles,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    </GenerativeQASingleResultContainer>
  );
}
