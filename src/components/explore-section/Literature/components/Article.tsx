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
import CopyIcon from '@/components/icons/CopyIcon';
import { classNames, formatDate } from '@/util/utils';
import CalendarIcon from '@/components/icons/Calendar';
import CitationIcon from '@/components/icons/CitationIcon';

export const DoiDefinition = `A DOI, or Digital Object Identifier, is a string of
 numbers, letters and symbols used to uniquely 
 identify an article or document, and to provide it 
 with a permanent web address (URL)`;

export function ArticlePreview({
  title,
  icon,
  altText,
  className,
}: {
  title: string;
  icon: JSX.Element;
  altText?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={classNames(
        'flex items-center justify-center gap-1 text-base font-normal text-primary-8',
        className ?? ''
      )}
      title={altText ?? title}
    >
      {icon}
      {title}
    </button>
  );
}

export function ArticleAction({
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
      className="flex items-center justify-center gap-2 rounded-md px-2 py-1 text-base font-normal text-primary-8 transition-all ease-out hover:bg-gray-200"
    >
      {icon}
      <span> {title} </span>
    </button>
  );
}

type ArticleProps = GArticle & {
  collapseAll: boolean;
  isCompact?: boolean;
};

export default function Article({
  title,
  doi,
  authors,
  paragraph,
  journal,
  journalISSN,
  collapseAll,
  publicationDate,
  citationsCount,
  isCompact = false,
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
      <div className="absolute -left-1 mt-1 flex h-2 w-2 items-center justify-center rounded-full bg-primary-8 first:mt-0" />

      <div className="-mt-1 mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
        <div className="flex items-start justify-between">
          <h1
            title={title}
            className="clear-right line-clamp-2 w-3/5 text-xl text-primary-8 hover:font-medium"
          >
            {title}
          </h1>
          {!isCompact && (
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
            </div>
          )}
        </div>
      </div>
      {!isCompact && (
        <div className="my-5 flex flex-wrap items-center gap-x-4 gap-y-1">
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
          {journal && (
            <ArticlePreview
              title={journal}
              icon={<JournalIcon />}
              altText={`${journal} ${journalISSN ?? ''}`}
              className="cursor-default"
            />
          )}
          {publicationDate && (
            <ArticlePreview
              title={formatDate(publicationDate)}
              icon={<CalendarIcon className="h-4 w-4" />}
              className="cursor-default"
            />
          )}
          {!isNil(citationsCount) && (
            <ArticlePreview
              title={`Times cited: ${citationsCount}`}
              icon={<CitationIcon className="h-4 w-4" />}
              altText={`Number of citations: ${citationsCount}`}
              className="cursor-default"
            />
          )}
        </div>
      )}
      <article className="mb-4 bg-[#F5F5F5] p-7">
        <div
          className={classNames(
            'mb-2 text-base font-normal text-gray-500',
            readmore
              ? 'transition-all delay-75 ease-out'
              : 'line-clamp-2 transition-all delay-75 ease-in'
          )}
        >
          {paragraph}
        </div>
        <button
          type="button"
          className="rounded-md bg-white px-3 py-2 text-sm"
          onClick={onReadMore}
        >
          {readmore ? 'Read less' : 'Read more'}
        </button>
      </article>
    </li>
  );
}
