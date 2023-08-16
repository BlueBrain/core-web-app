import type { GenerativeQASingleResultProps } from './GenerativeQAResults';
import Article from './Article';

type GenerativeQAResultsProps = Pick<GenerativeQASingleResultProps, 'articles'> & {
  collapseAll: boolean;
};

function ArticlesTimeLine({ articles, collapseAll }: GenerativeQAResultsProps) {
  return (
    <ol className="relative border-l border-gray-200 dark:border-gray-700">
      {articles.map(
        ({ id, title, doi, authors, journal, abstract, paragraph, section, paragraphId }) => (
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
              paragraphId,
            }}
          />
        )
      )}
    </ol>
  );
}

export default ArticlesTimeLine;
