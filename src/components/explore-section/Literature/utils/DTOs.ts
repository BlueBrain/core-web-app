import kebabCase from 'lodash/kebabCase';
import { GenerativeQA, GenerativeQAResponse } from '../../../../types/literature';

type GenerativeQADTO = {
  question: string;
  generativeQAResponse: GenerativeQAResponse;
};

const generativeQADTO = ({ question, generativeQAResponse }: GenerativeQADTO): GenerativeQA => {
  const askedAt = new Date();
  return {
    question,
    id: `${kebabCase(question)}-${askedAt.getTime()}}`,
    askedAt: new Date(),
    answer: generativeQAResponse.answer,
    rawAnswer: generativeQAResponse.raw_answer.split('SOURCES')?.[0],
    articles: generativeQAResponse.metadata.map((article) => ({
      id: article.article_id,
      doi: article.article_doi,
      title: article.article_title,
      authors: article.article_authors,
      journal: article.article_journal,
      section: article.section,
      paragraph: article.paragraph,
      abstract: article.article_abstract,
    })),
  };
};

export { generativeQADTO };
