'use client';

import { useCallback, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

import isNil from 'lodash/isNil';
import { copyClipboard } from '../utils';
import type { GArticle } from '@/types/literature';
import PersonIcon from '@/components/icons/Person';
import JournalIcon from '@/components/icons/Journal';
import { generateId } from '@/components/experiment-designer/GenericParamWrapper';
import QuoteOutline from '@/components/icons/QuoteOutline';
import CopyIcon from '@/components/icons/CopyIcon';
import { classNames, formatDate } from '@/util/utils';
import CalendarIcon from '@/components/icons/Calendar';
import CitationIcon from '@/components/icons/CitationIcon';

const DoiDefinition = `A DOI, or Digital Object Identifier, is a string of
 numbers, letters and symbols used to uniquely 
 identify an article or document, and to provide it 
 with a permanent web address (URL)`;

function ArticlePreview({
  title,
  icon,
  altText,
}: {
  title: string;
  icon: JSX.Element;
  altText?: string;
}) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-1 text-base font-normal text-primary-8"
      title={altText ?? title}
    >
      {icon}
      {title}
    </button>
  );
}

function ArticleAction({
  title,
  icon,
  onClick,
}: {
  title: string;
  onClick: Function;
  icon: JSX.Element;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className="flex items-center justify-center gap-2 px-2 py-1 text-base font-normal transition-all ease-out rounded-md text-primary-8 hover:bg-gray-200"
    >
      {icon}
      <span> {title} </span>
    </button>
  );
}

type ArticleProps = GArticle & {
  collapseAll: boolean;
};

export default function Article({
  title,
  doi,
  authors,
  journal,
  abstract,
  collapseAll,
  publicationDate,
  citationsCount,
}: ArticleProps) {
  const [readmore, setReadmore] = useState(() => collapseAll);
  const [DOIcopied, setDOIcopied] = useState(false);
  const onReadMore = () => setReadmore((state) => !state);

  const onCopy = useCallback(() => {
    copyClipboard(doi!);
    setDOIcopied(true);
    const timeoutId = setTimeout(() => {
      setDOIcopied(false);
      clearTimeout(timeoutId);
    }, 1000);
  }, [doi]);

  useEffect(() => {
    if (collapseAll) setReadmore(false);
  }, [collapseAll]);

  return (
    <li className="mb-10 ml-4" data-testid="article-item">
      <div className="absolute flex items-center justify-center w-2 h-2 mt-1 rounded-full bg-primary-8 first:mt-0 -left-1" />
      <div className="mb-1 -mt-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
        <div className="flex items-start justify-between">
          <h1
            title={title}
            className="clear-right w-3/5 text-xl line-clamp-2 text-primary-8 hover:font-medium"
          >
            {title}
          </h1>
          <div className="grid grid-flow-col gap-4">
            {doi && (
              <div className="flex">
                <ArticleAction
                  key="copy-doi"
                  onClick={onCopy}
                  title={DOIcopied ? 'copied' : 'Copy DOI'}
                  icon={
                    DOIcopied ? <CheckCircleOutlined className="text-teal-600" /> : <CopyIcon />
                  }
                />
                <Tooltip
                  title={DoiDefinition}
                  color="#003A8C"
                  overlayInnerStyle={{ borderRadius: '0px', background: '#003A8C' }}
                >
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </div>
            )}
            <ArticleAction key="quote" onClick={() => {}} title="Quote" icon={<QuoteOutline />} />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 my-5">
        <Tooltip
          title="Authors"
          placement="bottomLeft"
          overlayInnerStyle={{ backgroundColor: 'white' }}
          arrow={false}
          overlay={
            <div className="flex flex-col gap-2">
              {authors.map((author) => {
                const key = generateId(title, author);
                return (
                  <div key={key} className="text-sm text-gray-900">
                    {author}
                  </div>
                );
              })}
            </div>
          }
          trigger="hover"
        >
          <div>
            <ArticlePreview title={authors.at(0)!} icon={<PersonIcon />} />
          </div>
        </Tooltip>
        {journal && <ArticlePreview title={journal} icon={<JournalIcon />} altText="Journal" />}
        {publicationDate && (
          <ArticlePreview title={formatDate(publicationDate)} icon={<CalendarIcon />} />
        )}
        {!isNil(citationsCount) && (
          <ArticlePreview
            title={`${citationsCount} times`}
            icon={<CitationIcon />}
            altText={`Number of citations: ${citationsCount}`}
          />
        )}
      </div>
      <article className="bg-[#F5F5F5] mb-4 p-7">
        <div
          className={classNames(
            'mb-2 text-base font-normal text-gray-500',
            readmore
              ? 'transition-all delay-75 ease-out'
              : 'line-clamp-2 transition-all delay-75 ease-in'
          )}
        >
          {abstract}
        </div>
        <button
          type="button"
          className="px-3 py-2 text-sm bg-white rounded-md"
          onClick={onReadMore}
        >
          {readmore ? 'Read less' : 'Read more'}
        </button>
      </article>
    </li>
  );
}
