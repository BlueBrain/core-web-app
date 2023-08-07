import React, { useEffect, useState } from 'react';
import { FilterOutlined } from '@ant-design/icons';
import trim from 'lodash/trim';
import { format } from 'date-fns';
import { useLiteratureAtom } from '../state';
import { TGenerativeQA } from '../types';
import ArticlesTimeLine from './ArticlesTimeLine';
import BrainLight from '@/components/icons/BrainLight';
import { ChevronIcon } from '@/components/icons';

export type TQASingleResultProps = Omit<TGenerativeQA, 'sources' | 'paragraphs'>;
function QASingleResult({
  id,
  question,
  askedAt,
  answer,
  rawAnswer,
  articles,
}: TQASingleResultProps) {
  const [expandArticles, setExpandArticles] = useState(false);
  const [collpaseQuestion, setCollpaseQuestion] = useState(false);
  const update = useLiteratureAtom();
  const answerRef = React.useRef<HTMLLIElement>(null);
  const toggleExpandArticles = () => setExpandArticles((state) => !state);
  const toggleCollapseQuestion = () => setCollpaseQuestion((state) => !state);
  const openFilterPanel = () => update('isFilterPanelOpen', true);

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

  return (
    <li id={id} className={` w-full mt-3 ${collpaseQuestion ? 'mb-6' : 'mb-28'}`} ref={answerRef}>
      <div className="inline-flex items-center w-full gap-2">
        <div className="w-auto h-px bg-neutral-3 flex-[1_1]" />
        <span className="pl-2 text-sm w-max text-neutral-4">
          Asked {format(new Date(askedAt), 'dd/MM/yyyy - kk:mm')}
        </span>
      </div>
      <div className="inline-flex items-center justify-between w-full">
        <div className="inline-flex items-center justify-start w-full gap-2 my-5">
          <BrainLight />
          <span
            className={`font-normal tracking-tight text-blue-900 ${
              collpaseQuestion ? 'text-xl font-extrabold' : 'text-sm'
            }`}
          >
            {question}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleCollapseQuestion}
          className="flex items-center justify-center w-8 h-8 p-px rounded-full hover:shadow-md"
        >
          <ChevronIcon
            fill="#003A8C"
            className={`${collpaseQuestion ? 'rotate-0' : 'rotate-90'}`}
          />
        </button>
      </div>
      <div className={`${collpaseQuestion ? 'hidden' : 'block'}`}>
        <div className="w-full text-xl font-normal leading-7 text-blue-900">{finalAnswer}</div>
        <div className={`w-full h-px my-6 bg-zinc-300 ${showExtraDetails ? '' : 'hidden'}`} />
        <div className={`w-full ${showExtraDetails ? '' : 'hidden'}`}>
          <div className="inline-flex items-center justify-between w-full gap-y-3">
            <button
              type="button"
              onClick={toggleExpandArticles}
              className="w-[350px] h-11 px-3 py-3 gap-1.5 bg-blue-50 text-white shadow-sm  rounded-md relative inline-flex justify-between items-center whitespace-nowrap cursor-pointer no-underline leading-tight transition-all duration-200 "
              aria-controls="collapse-content"
            >
              <div className="inline-flex items-center justify-start gap-1">
                <div className="text-base font-normal leading-snug text-blue-900">Based on</div>
                <div className="px-1 py-[.2px] bg-blue-900 rounded-[3px] flex-col justify-start items-center inline-flex">
                  <span className="text-sm font-bold tracking-tight text-blue-50">
                    {articles.length}
                  </span>
                </div>
                <div className="text-base font-normal leading-snug text-blue-900">articles</div>
              </div>
              <ChevronIcon
                fill="#003A8C"
                className={`${expandArticles ? '-rotate-90' : 'rotate-90'}`}
              />
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-2 py-1 cursor-pointer"
              onClick={openFilterPanel}
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
                  articles,
                  collapseAll: expandArticles,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default QASingleResult;
