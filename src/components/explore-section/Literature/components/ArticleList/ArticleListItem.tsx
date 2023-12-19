'use client';

import isNil from 'lodash/isNil';
import { useReducer } from 'react';
import { Button, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ArticleAction, ArticlePreview, DoiDefinition } from '../Article';
import { ArticleItem } from '@/api/explore-section/resources';
import PersonIcon from '@/components/icons/Person';
import JournalIcon from '@/components/icons/Journal';
import { formatDate } from '@/util/utils';
import CalendarIcon from '@/components/icons/Calendar';
import CitationIcon from '@/components/icons/CitationIcon';
import CopyIcon from '@/components/icons/CopyIcon';
import QuoteOutline from '@/components/icons/QuoteOutline';
import CopyTextBtn from '@/components/CopyTextBtn';

type Props = {
  article: ArticleItem;
  index: number;
};

export default function ArticleListItem({ article, index }: Props) {
  const [trimAbstract, toggleTrimAbstract] = useReducer((value) => !value, true);

  const abstract = trimAbstract ? article.abstract?.slice(0, 400).concat('...') : article.abstract;

  return (
    <article>
      <h6 className="text-sm leading-6 text-gray-400 pt-2 pr-8 mb-2">Article {index + 1}</h6>
      <div className="w-6 h-[2px] bg-gray-300" />
      <div className="flex justify-between items-center">
        <h4 className="mt-3 mb-4 text-primary-8 leading-7 font-bold text-xl">{article.title}</h4>
        <div className="flex">
          {article.doi && (
            <div className="flex mx-2">
              <CopyTextBtn
                text={article.doi}
                icon={<CopyIcon />}
                className="flex items-center justify-center gap-2 px-2 py-1 text-base font-normal rounded-md text-primary-8 hover:bg-gray-200 w-max"
              >
                Copy DOI
              </CopyTextBtn>
              <Tooltip
                title={DoiDefinition}
                color="#003A8C"
                overlayInnerStyle={{ borderRadius: '0px', background: '#003A8C' }}
              >
                <InfoCircleOutlined className="text-gray-400" />
              </Tooltip>
            </div>
          )}
          <ArticleAction key="cite" onClick={() => {}} title="Cite" icon={<QuoteOutline />} />
        </div>
      </div>

      <div className="flex items-center gap-x-7 mb-3">
        {article.authors.length > 0 && (
          <Tooltip
            title="Authors"
            placement="bottomLeft"
            overlayInnerStyle={{ backgroundColor: 'white' }}
            arrow={false}
            overlay={
              <div className="flex flex-col gap-2">
                {article.authors.map((author) => {
                  return (
                    <div key={author} className="text-sm text-gray-900">
                      {author}
                    </div>
                  );
                })}
              </div>
            }
            trigger="hover"
          >
            <div>
              <ArticlePreview
                title={article.authors[0]}
                icon={<PersonIcon style={{ borderColor: '#D9D9D9' }} />}
              />
            </div>
          </Tooltip>
        )}
        {article.journalName && (
          <ArticlePreview
            title={article.journalName}
            icon={<JournalIcon style={{ borderColor: '#D9D9D9' }} />}
            altText={`${article.journalName}`}
          />
        )}
        {article.publicationDate && (
          <ArticlePreview
            title={formatDate(article.publicationDate)}
            icon={<CalendarIcon className="w-4 h-4" style={{ borderColor: '#D9D9D9' }} />}
          />
        )}
        {!isNil(article.citationCount) && (
          <ArticlePreview
            title={`Times cited: ${article.citationCount}`}
            icon={<CitationIcon className="w-4 h-4" style={{ borderColor: '#D9D9D9' }} />}
            altText={`Number of citations: ${article.citationCount}`}
          />
        )}
      </div>
      <p className="text-base text-primary-8 border border-gray-200 px-7 py-3">
        {isNil(article.abstract) ? 'No abstract available' : abstract}
        <br />
        {article.abstract && (
          <Button
            className="px-3 py-2 text-sm leading-5 text-primary-8 shadow-none rounded-md mt-3 bg-gray-100"
            onClick={toggleTrimAbstract}
          >
            {trimAbstract ? 'Read more' : 'Read less'}
          </Button>
        )}
      </p>
    </article>
  );
}
