'use client';

import { useEffect, useRef, useState } from 'react';
import { FilterOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { format } from 'date-fns';
import trim from 'lodash/trim';

import useContextualLiteratureContext from '../useContextualLiteratureContext';
import ArticlesTimeLine from './ArticlesTimeLine';
import ArticleSorter from './ArticleSorter';
import { QABrainRegionPerQuestion } from './QABrainRegion';
import { FilterFns } from './FilterPanel';
import { GenerativeQA, FilterFieldsType, SortFn } from '@/types/literature';
import { ChevronIcon } from '@/components/icons';
import { classNames } from '@/util/utils';
import { literatureAtom, useLiteratureAtom } from '@/state/literature';
import BrainLight from '@/components/icons/BrainLight';
import LightIcon from '@/components/icons/Light';

export type GenerativeQASingleResultProps = Omit<GenerativeQA, 'sources' | 'paragraphs'>;

function GenerativeQASingleNotFound({ collpaseQuestion }: { collpaseQuestion?: boolean }) {
  return (
    <div
      className={classNames(
        'flex flex-col items-start justify-center w-full gap-y-1 max-h-max',
        collpaseQuestion ? 'hidden' : 'block'
      )}
    >
      <p className="w-full px-5 py-4 mb-px text-base font-medium text-center text-amber-500 bg-orange-50">
        We found no specific answer to your question.
      </p>
      <div className="inline-flex items-center justify-center gap-x-1 text-primary-8">
        <LightIcon className="w-4 h-4 text-primary-8" />
        <div className="font-light">Please reformulate your question .</div>
      </div>
    </div>
  );
}

function GenerativeQASingleResultCompact({
  id,
  question,
  answer,
  rawAnswer,
  articles,
  isNotFound,
}: GenerativeQASingleResultProps) {
  const showExtraDetails = Boolean(articles.length);
  const [expandArticles, setExpandArticles] = useState(false);
  const toggleExpandArticles = () => setExpandArticles((state) => !state);

  let finalAnswer = answer;

  if (answer && trim(answer).length > 0) {
    finalAnswer = answer;
  } else if (rawAnswer && trim(rawAnswer).length > 0) {
    finalAnswer = rawAnswer;
  }

  return (
    <div id={id} className={classNames('w-full mt-3')}>
      <div className="inline-flex items-center justify-between w-full mb-2">
        <div className="inline-flex items-center justify-start w-full gap-2 my-5">
          <span className="text-xl font-bold tracking-tight text-blue-900">{question}</span>
        </div>
      </div>
      {isNotFound ? (
        <GenerativeQASingleNotFound />
      ) : (
        <div className="block">
          <div className="w-full text-xl font-normal leading-7 text-blue-900">{finalAnswer}</div>
          <div className={`w-full h-px my-6 bg-zinc-300 ${showExtraDetails ? '' : 'hidden'}`} />
          <div className={`w-full ${showExtraDetails ? '' : 'hidden'}`}>
            <div className="inline-flex items-center justify-between w-full gap-y-3">
              <div className="flex items-center w-full">
                <button
                  type="button"
                  onClick={toggleExpandArticles}
                  className="w-full h-11 px-3 py-3 gap-1.5 bg-blue-50 text-white shadow-sm  rounded-md relative inline-flex justify-between items-center whitespace-nowrap cursor-pointer no-underline leading-tight transition-all duration-200"
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
              </div>
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
              <div className="mt-4 rounded mb-28">
                <ArticlesTimeLine
                  {...{
                    articles,
                    isCompact: true,
                    collapseAll: expandArticles,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GenerativeQASingleResult({
  id,
  question,
  askedAt,
  answer,
  rawAnswer,
  brainRegion,
  articles,
  isNotFound,
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
    <div
      id={id}
      className={classNames(
        'w-full mt-3',
        collpaseQuestion || expandArticles ? 'mb-4 last:mb-[280px]' : 'mb-28 last:mb-[320px]'
      )}
      ref={answerRef}
    >
      <div className="inline-flex items-center w-full gap-2">
        <div className="w-auto h-px bg-neutral-3 flex-[1_1]" />
        <span className="pl-2 text-sm w-max text-neutral-4">
          Asked {format(new Date(askedAt), 'dd.MM.yyyy - kk:mm')}
        </span>
      </div>
      <div className="inline-flex items-center justify-between w-full mb-2">
        <div className="inline-flex items-center justify-start w-full gap-2 my-5">
          <BrainLight />
          <span
            className={classNames(
              'font-normal tracking-tight text-blue-900',
              collpaseQuestion ? 'text-xl font-extrabold' : 'text-sm'
            )}
            data-testid="question-result"
          >
            {question}
          </span>
        </div>
        <div className="inline-flex items-center justify-end gap-2">
          {brainRegion?.id && (
            <QABrainRegionPerQuestion id={brainRegion.id} title={brainRegion.title} />
          )}
          <button
            type="button"
            onClick={toggleCollapseQuestion}
            className="flex items-center justify-center w-8 h-8 p-px rounded-full min-w-[2rem] hover:shadow-md"
          >
            <ChevronIcon
              className={classNames(
                'transition-transform duration-300 ease-in-out text-primary-8 fill-current',
                collpaseQuestion ? 'rotate-0' : 'rotate-90'
              )}
            />
          </button>
        </div>
      </div>
      {isNotFound ? (
        <GenerativeQASingleNotFound {...{ collpaseQuestion }} />
      ) : (
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
      )}
    </div>
  );
}

function QAResultList() {
  const qaResultsRef = useRef<HTMLDivElement>(null);
  const { dataSource } = useContextualLiteratureContext();

  useEffect(() => {
    if (qaResultsRef.current) {
      qaResultsRef.current.scrollTo({
        behavior: 'smooth',
        top: qaResultsRef.current.scrollHeight,
      });
    }
  }, [dataSource.length]);

  return (
    <div className="w-full h-full max-h-screen">
      <div className="flex-1 w-full h-full overflow-auto scroll-smooth" ref={qaResultsRef}>
        <ul className="flex flex-col items-center justify-start max-w-4xl p-4 mx-auto list-none">
          {dataSource.map(
            ({ id, question, answer, rawAnswer, articles, askedAt, brainRegion, isNotFound }) => (
              <GenerativeQASingleResult
                key={id}
                {...{
                  id,
                  askedAt,
                  question,
                  answer,
                  rawAnswer,
                  articles,
                  brainRegion,
                  isNotFound,
                }}
              />
            )
          )}
        </ul>
      </div>
    </div>
  );
}

export { GenerativeQASingleResult, GenerativeQASingleNotFound, GenerativeQASingleResultCompact };
export default QAResultList;
