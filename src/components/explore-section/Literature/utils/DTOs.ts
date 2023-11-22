import {
  FailedGenerativeQA,
  GenerativeQA,
  GenerativeQADTO,
  SucceededGenerativeQA,
} from '@/types/literature';

export const STREAM_JSON_DATA_SEPARATOR_REGEX = /<bbs_json_(data|error)>/g;
export const ASKED_TIME_SEPARATOR = '@time:';

const generativeQADTO = ({
  question,
  response,
  askedAt,
  isNotFound,
  questionId,
}: GenerativeQADTO): GenerativeQA =>
  isNotFound
    ? ({
        question,
        askedAt,
        isNotFound,
        id: questionId,
        statusCode: response.code.toString(),
        details: response.detail,
      } as FailedGenerativeQA)
    : ({
        question,
        askedAt,
        isNotFound,
        id: questionId,
        answer: response.answer ?? '',
        rawAnswer: response.raw_answer?.split('SOURCES')?.[0] ?? '',
        articles: response.metadata
          ? response.metadata.map((article, index) => ({
              id: `${article.article_id}-${index}-${questionId}-${article.paragraph_id}`,
              doi: article.article_doi,
              title: article.article_title,
              authors: article.article_authors,
              journal: article.journal_name,
              journalISSN: article.journal_issn,
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
      } as SucceededGenerativeQA);

export { generativeQADTO };
