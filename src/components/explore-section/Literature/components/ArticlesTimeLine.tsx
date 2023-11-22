import Article from './Article';
import { GenerativeQASingleResultProps } from '@/types/literature';

type GenerativeQAResultsProps = Pick<GenerativeQASingleResultProps, 'articles'> & {
  collapseAll: boolean;
  isCompact?: boolean;
};

function ArticlesTimeLine({ articles, collapseAll, isCompact }: GenerativeQAResultsProps) {
  return (
    <ol className="relative border-l border-gray-200 dark:border-gray-700">
      {articles.map(
        ({
          id,
          title,
          doi,
          authors,
          journal,
          journalISSN,
          abstract,
          paragraph,
          paragraphId,
          section,
          publicationDate,
          impactFactor,
          citationsCount,
        }) => (
          <Article
            key={id}
            {...{
              id,
              title,
              doi,
              authors,
              journal,
              journalISSN,
              abstract,
              paragraph,
              paragraphId,
              section,
              collapseAll,
              publicationDate,
              citationsCount,
              impactFactor,
              isCompact,
            }}
          />
        )
      )}
    </ol>
  );
}

export default ArticlesTimeLine;
