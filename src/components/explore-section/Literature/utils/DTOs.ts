import kebabCase from 'lodash/kebabCase';
import { GenerativeQA, GenerativeQAResponse } from '@/types/literature';

type GenerativeQADTO = {
  question: string;
  generativeQAResponse: GenerativeQAResponse;
};

const generativeQADTO = ({ question, generativeQAResponse }: GenerativeQADTO): GenerativeQA => {
  const askedAt = new Date();
  const questionId = `${kebabCase(question)}-${askedAt.getTime()}`;

  return {
    question,
    id: questionId,
    askedAt: new Date(),
    answer: generativeQAResponse.answer,
    rawAnswer: generativeQAResponse.raw_answer.split('SOURCES')?.[0],
    articles: generativeQAResponse.metadata.map((article, index) => ({
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
    })),
  };
};

export { generativeQADTO };
