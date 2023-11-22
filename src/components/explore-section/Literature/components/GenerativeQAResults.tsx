'use client';

import { useEffect, useReducer, useRef, useState, memo, ReactNode } from 'react';
import { FilterOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { format } from 'date-fns';
import { Button } from 'antd';
import trim from 'lodash/trim';
import delay from 'lodash/delay';

import useStreamGenerative from '../useStreamGenerative';
import { useLiteratureDataSource } from '../useContextualLiteratureContext';
import ArticlesTimeLine from './ArticlesTimeLine';
import ArticleSorter from './ArticleSorter';
import { QABrainRegionPerQuestion } from './QABrainRegion';
import { FilterFns } from './FilterPanel';
import {
  FilterFieldsType,
  SortFn,
  SucceededGenerativeQA,
  FailedGenerativeQA,
  SelectedBrainRegionPerQuestion,
} from '@/types/literature';
import { ChevronIcon } from '@/components/icons';
import { classNames } from '@/util/utils';
import { literatureAtom, useLiteratureAtom, useLiteratureResultsAtom } from '@/state/literature';
import BrainLight from '@/components/icons/BrainLight';
import LightIcon from '@/components/icons/Light';

export type GenerativeQASingleResultProps = Omit<SucceededGenerativeQA, 'sources' | 'paragraphs'>;
type GenerativeQASingleResultHeaderProps = Pick<
  GenerativeQASingleResultProps,
  'askedAt' | 'question' | 'brainRegion'
> & {
  collpaseQuestion?: boolean;
  toggleCollapseQuestion: () => void;
};

const GENERATIVE_QA_ERRORS_MAP: { [key: string]: string } = {
  '1': 'Unfortunately, I could not find any relevant information in our database.\n Please try your request again later',
  '2': "I apologize, but I couldn't find an answer based on the available information.\n Please attempt your request again later.",
  '3': 'Our service is temporarily unavailable, possibly due to technical difficulties.\n Please try your request again at a later time',
  '4': 'Your request is too long for us to process.\n Please reduce the length of your input and try again.',
  '5': "We're currently experiencing high demand, which is affecting our service.\n Please attempt your request again later.",
  '6': "We apologize, but we couldn't provide a complete answer to your question.\n This may be due to a problem on our side. Please try your request again later.",
  default: 'An unexpected error has occurred.\n Please try your request again later.',
};

function GenerativeQASingleResultContainer({
  id,
  moreSpace,
  className,
  children,
}: {
  id: string;
  className?: string;
  moreSpace: boolean;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      className={classNames(
        'w-full mt-3',
        moreSpace ? 'mb-4 last:mb-[280px]' : 'mb-28 last:mb-[320px]',
        className
      )}
    >
      {children}
    </div>
  );
}

function GenerativeQASingleResultHeader({
  question,
  askedAt,
  brainRegion,
  collpaseQuestion,
  toggleCollapseQuestion,
}: GenerativeQASingleResultHeaderProps) {
  return (
    <>
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
            aria-label="Expand question"
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
    </>
  );
}

function GenerativeQASingleResultError({
  askedAt,
  id,
  question,
  brainRegion,
  statusCode,
  showHeader = true,
  showRemoveBtn = true,
}: FailedGenerativeQA & { showHeader?: boolean; showRemoveBtn?: boolean }) {
  const { remove } = useLiteratureResultsAtom();
  const [collpaseQuestion, toggleCollapseQuestion] = useReducer((val) => !val, false);
  const [deletingPending, toggleDelete] = useReducer((val) => !val, false);

  const onDelete = () => {
    toggleDelete();
    delay(() => {
      remove(id);
      toggleDelete();
    }, 1000);
  };

  return (
    <GenerativeQASingleResultContainer
      id={id}
      moreSpace={collpaseQuestion}
      className={classNames(deletingPending ? 'animate-scale-down' : '')}
    >
      <>
        {showHeader && (
          <GenerativeQASingleResultHeader
            {...{
              question,
              askedAt,
              brainRegion,
              collpaseQuestion,
              toggleCollapseQuestion,
            }}
          />
        )}
        <div
          className={classNames(
            'flex flex-col items-start justify-center w-full gap-y-1 max-h-max',
            collpaseQuestion ? 'hidden' : 'block'
          )}
        >
          <div className="bg-orange-50 w-full px-5 py-4 flex flex-col items-center justify-center">
            <p className="w-full mb-px text-base font-medium text-center text-amber-500 whitespace-pre-line">
              {GENERATIVE_QA_ERRORS_MAP[statusCode as keyof typeof GENERATIVE_QA_ERRORS_MAP] ??
                GENERATIVE_QA_ERRORS_MAP.default}
            </p>
            {showRemoveBtn && (
              <Button
                type="default"
                className="bg-transparent rounded-none mt-4 text-amber-500 font-bold hover:!border-amber-500 hover:!text-amber-500"
                onClick={onDelete}
              >
                Remove question
              </Button>
            )}
          </div>
          <div className="inline-flex items-center justify-center gap-x-1 text-primary-8">
            <LightIcon className="w-4 h-4 text-primary-8" />
            <div className="font-light">Please reformulate your question .</div>
          </div>
        </div>
      </>
    </GenerativeQASingleResultContainer>
  );
}

function GenerativeQASingleResultCompact({
  id,
  question,
  answer,
  rawAnswer,
  articles,
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
                  <div className="text-base font-normal leading-snug text-blue-900">paragraphs</div>
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

  const showExtraDetails = Boolean(articles?.length);

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
          {articles && Boolean(articles.length) && (
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
          )}
        </div>
      </>
    </GenerativeQASingleResultContainer>
  );
}

const GenerativeQAResult = memo(
  ({
    id,
    streamed,
    question,
    askedAt,
    brainRegion,
    goToBottom,
  }: {
    id: string;
    question: string;
    askedAt: Date;
    streamed: boolean;
    brainRegion: SelectedBrainRegionPerQuestion | undefined;
    goToBottom: () => void;
  }) => {
    const { answer, current } = useStreamGenerative({
      id,
      question,
      streamed,
      goToBottom,
      askedAt,
    });

    return (
      <GenerativeQASingleResult
        key={id}
        answer={answer}
        rawAnswer={(current as SucceededGenerativeQA)?.rawAnswer ?? ''}
        articles={(current as SucceededGenerativeQA)?.articles ?? []}
        streamed={(current as SucceededGenerativeQA)?.streamed ?? true}
        isNotFound={(current as SucceededGenerativeQA)?.isNotFound ?? false}
        {...{
          id,
          askedAt,
          question,
          brainRegion,
        }}
      />
    );
  }
);

function QAResultList() {
  const firstRenderRef = useRef(false);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const dataSource = useLiteratureDataSource();

  const goToBottom = () => {
    delay(() => {
      if (resultsContainerRef.current) {
        resultsContainerRef?.current.scrollTo({
          behavior: 'smooth',
          top: resultsContainerRef.current.scrollHeight,
        });
      }
    }, 500);
  };

  useEffect(() => {
    if (dataSource.length > 0 && resultsContainerRef.current && !firstRenderRef.current) {
      resultsContainerRef?.current.scrollTo({
        behavior: 'smooth',
        top: resultsContainerRef.current.scrollHeight,
      });
      firstRenderRef.current = true;
    }
  }, [dataSource]);

  return (
    <div className="w-full h-full max-h-screen transition-height duration-700 ease-linear">
      <div className="flex-1 w-full h-full overflow-auto scroll-smooth" ref={resultsContainerRef}>
        <ul className="flex flex-col items-center justify-start max-w-4xl p-4 mx-auto list-none">
          {dataSource.map(({ id, question, askedAt, streamed, brainRegion, chatId }) => (
            <GenerativeQAResult
              key={id}
              goToBottom={goToBottom}
              {...{ id, question, askedAt, streamed, brainRegion, chatId }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

GenerativeQAResult.displayName = 'GenerativeQAResult';
export { GenerativeQASingleResult, GenerativeQASingleResultError, GenerativeQASingleResultCompact };
export default QAResultList;
