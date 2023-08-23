import * as LiteratureErrors from './errors';
import { GenerativeQAResponse, ReturnGetGenerativeQA } from '@/types/literature';
import { nexus } from '@/config';

const getGenerativeQA: ReturnGetGenerativeQA = async ({ question, session, keywords }) => {
  try {
    const hasKeywords = keywords && !!keywords.length;
    const keywordsSearchParam = hasKeywords
      ? new URLSearchParams(keywords.map((kw) => ['keywords', kw]))
      : '';
    const urlQueryParams = hasKeywords ? `?${keywordsSearchParam.toString()}` : '';
    const url = `${nexus.aiUrl}/generative_qa${urlQueryParams}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: new Headers({
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      }),
      body: JSON.stringify({
        query: question,
      }),
    });
    const generativeQAResponse = (await response.json()) as GenerativeQAResponse;

    return {
      question,
      response: generativeQAResponse,
    };
  } catch (error: unknown) {
    if (error instanceof LiteratureErrors.LiteratureValidationError) {
      throw new LiteratureErrors.LiteratureValidationError(error.detail);
    }
    throw new Error((error as Error).message);
  }
};

export { getGenerativeQA };
