import { useReducer } from 'react';

import ArticlesTimeLine from '../ArticlesTimeLine';
import { ResultSuccessProps } from './ResultSuccess';
import { classNames } from '@/util/utils';
import { ChevronIcon } from '@/components/icons';

export default function ResultCompact({ id, question, articles, children }: ResultSuccessProps) {
  const showExtraDetails = articles && Boolean(articles.length);
  const [expandArticles, toggleExpandArticles] = useReducer((value) => !value, false);

  return (
    <div id={id} className={classNames('w-full mt-3')}>
      <div className="inline-flex items-center justify-between w-full mb-2">
        <div className="inline-flex items-center justify-start w-full gap-2 my-5">
          <span className="text-xl font-bold tracking-tight text-blue-900">{question}</span>
        </div>
      </div>
      <div className="block">
        {children}
        <div className={`w-full h-px my-6 bg-zinc-300 ${showExtraDetails ? '' : 'hidden'}`} />
        {showExtraDetails && (
          <div className="w-full">
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
        )}
      </div>
    </div>
  );
}
