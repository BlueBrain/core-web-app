'use client';

import isNil from 'lodash/isNil';
import { useState } from 'react';
import { Button } from 'antd';
import { ArticleItem } from '@/api/explore-section/resources';

type Props = {
  article: ArticleItem;
  index: number;
};

export default function ArticleListItem({ article, index }: Props) {
  const [trimAbstract, setTrimAbstract] = useState(true);

  const abstract = trimAbstract ? article.abstract?.slice(0, 400).concat('...') : article.abstract;
  return (
    <article>
      <span className="bg-gray-100 text-sm leading-6 text-primary-8 py-2 pl-3 pr-8 mb-2">
        Article {index + 1}
      </span>
      <h4 className="mt-3 mb-4 text-primary-8 leading-7 font-bold text-xl">{article.title}</h4>
      <p className="text-base text-primary-8 border border-primary-2 p-7">
        {isNil(article.abstract) ? 'No abstract available' : abstract}
        <Button
          className="px-3 py-2 text-sm bg-white rounded-md ml-2"
          onClick={() => setTrimAbstract((prev) => !prev)}
        >
          {trimAbstract ? 'Read more' : 'Read less'}
        </Button>
      </p>
    </article>
  );
}
