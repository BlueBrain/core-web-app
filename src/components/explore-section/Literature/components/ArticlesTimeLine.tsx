import React from 'react';
import type { TQASingleResultProps } from './QASingleResult';
import Article from './Article';

type TGenerativeQAResultsProps = Pick<TQASingleResultProps, 'articles'> & {
  collapseAll: boolean;
};

function ArticlesTimeLine({ articles, collapseAll }: TGenerativeQAResultsProps) {
  return (
    <ol className="relative border-l border-gray-200 dark:border-gray-700">
      {articles.map(({ id, title, doi, authors, journal, abstract, paragraph, section }) => (
        <Article
          key={id}
          {...{
            id,
            title,
            doi,
            authors,
            journal,
            abstract,
            paragraph,
            section,
            collapseAll,
          }}
        />
      ))}
    </ol>
  );
}

export default ArticlesTimeLine;
