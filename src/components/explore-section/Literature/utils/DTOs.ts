import kebabCase from 'lodash/kebabCase';
import { GenerativeQA, GenerativeQAWithDataResponse } from '@/types/literature';

const generativeQADTO = ({
  question,
  response,
  isNotFound,
}: {
  question: string;
  isNotFound: boolean;
  response?: GenerativeQAWithDataResponse;
}): GenerativeQA => {
  const askedAt = new Date();
  const questionId = `${kebabCase(question)}-${askedAt.getTime()}`;

  return {
    question,
    askedAt,
    isNotFound,
    id: questionId,
    answer: response?.answer ?? '',
    rawAnswer: response?.raw_answer?.split('SOURCES')?.[0] ?? '',
    articles: response?.metadata
      ? response.metadata.map((article, index) => ({
          id: `${article.article_id}-${index}-${questionId}-${article.paragraph_id}`,
          doi: article.article_doi,
          title: article.article_title,
          authors: article.article_authors,
          journal: article.journal,
          section: article.section,
          paragraph: article.paragraph,
          paragraphId: article.paragraph_id,
          articleType: article.article_type,
          abstract: article.abstract,
          publicationDate: article.date,
          citationsCount: article.cited_by,
          impactFactor: article.impact_factor,
        }))
      : [],
  };
};

export { generativeQADTO };
