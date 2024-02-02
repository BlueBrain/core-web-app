import { useReducer } from 'react';

import ArticlesTimeLine from '../ArticlesTimeLine';
import { ResultSuccessProps } from './ResultSuccess';
import { classNames } from '@/util/utils';
import { ChevronIcon } from '@/components/icons';

export default function ResultCompact({ id, question, articles, children }: ResultSuccessProps) {
  const showExtraDetails = articles && Boolean(articles.length);
  const [expandArticles, toggleExpandArticles] = useReducer((value) => !value, false);

  return (
    <div id={id} className={classNames('mt-3 w-full')}>
      <div className="mb-2 inline-flex w-full items-center justify-between">
        <div className="my-5 inline-flex w-full items-center justify-start gap-2">
          <span className="text-xl font-bold tracking-tight text-blue-900">{question}</span>
        </div>
      </div>
      <div className="block">
        {children}
        <div className={`my-6 h-px w-full bg-zinc-300 ${showExtraDetails ? '' : 'hidden'}`} />
        {showExtraDetails && (
          <div className="w-full">
            <div className="inline-flex w-full items-center justify-between gap-y-3">
              <div className="flex w-full items-center">
                <button
                  type="button"
                  onClick={toggleExpandArticles}
                  className="relative inline-flex h-11 w-full cursor-pointer items-center justify-between gap-1.5  whitespace-nowrap rounded-md bg-blue-50 px-3 py-3 leading-tight text-white no-underline shadow-sm transition-all duration-200"
                  aria-controls="collapse-content"
                  aria-label="expand-articles"
                >
                  <div className="inline-flex items-center justify-start gap-1">
                    <div className="text-base font-normal leading-snug text-blue-900">Based on</div>
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
              </div>
            </div>
            <div
              id="collapse-content"
              className={`mt-5 ${
                expandArticles
                  ? 'block overflow-hidden px-1 opacity-100 transition-all duration-300 ease-out-expo'
                  : 'hidden transition-all duration-100 ease-in-expo'
              }`}
            >
              <div className="mb-28 mt-4 rounded">
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
