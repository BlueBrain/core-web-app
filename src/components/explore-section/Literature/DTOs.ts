import kebabCase from 'lodash/kebabCase';
import { TGenerativeQA, TGenerativeQAResponse } from './types';

type TGenerativeQADTO = {
  question: string;
  generativeQAResponse: TGenerativeQAResponse;
};

const generativeQADTO = ({ question, generativeQAResponse }: TGenerativeQADTO): TGenerativeQA => {
  const askedAt = new Date();
  return {
    question,
    id: `${kebabCase(question)}-${askedAt.getTime()}`,
    askedAt: new Date(),
    answer: generativeQAResponse.answer,
    rawAnswer: generativeQAResponse.raw_answer.split('SOURCES')?.[0],
    articles: generativeQAResponse.metadata.map((article) => ({
      id: article.article_id,
      doi: article.article_doi,
      title: article.article_title,
      authors: article.article_authors,
      journal: article.article_doi,
      section: article.section,
      paragraph: article.paragraph,
      abstract: article.article_abstract,
    })),
  };
};

export { generativeQADTO };
