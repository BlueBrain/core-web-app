import toInteger from 'lodash/toInteger';

import {
  FailedGenerativeQA,
  GenerativeQA,
  GenerativeQADTO,
  SucceededGenerativeQA,
} from '@/types/literature';

export const DATA_SEPERATOR = '<bbs_json_data>';
export const ERROR_SEPERATOR = '<bbs_json_error>';
export const SOURCES_SEPERATOR = '<bbs_sources>';
export const STREAM_JSON_DATA_SEPARATOR_REGEX = /(<bbs_json_data>|<bbs_json_error>)/g;

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
        statusCode: toInteger(response.code).toString(),
        details: response.detail,
        rawRanswer: response.raw_answer,
      } as FailedGenerativeQA)
    : ({
        question,
        askedAt,
        isNotFound,
        id: questionId,
        answer: response.answer?.split(SOURCES_SEPERATOR)?.[0] ?? '',
        rawAnswer: response.raw_answer?.split(SOURCES_SEPERATOR)?.[0] ?? '',
        articles: response.metadata
          ? response.metadata.map((article, index) => ({
              id: `${article.article_id}-${index}-${questionId}-${article.ds_document_id}`,
              doi: article.article_doi,
              title: article.article_title,
              authors: article.article_authors,
              journal: article.journal_name,
              journalISSN: article.journal_issn,
              section: article.section,
              paragraph: article.paragraph,
              paragraphId: article.ds_document_id,
              articleType: article.article_type,
              abstract: article.abstract,
              publicationDate: article.date,
              citationsCount: article.cited_by,
              impactFactor: article.impact_factor,
            }))
          : [],
      } as SucceededGenerativeQA);

export { generativeQADTO };
