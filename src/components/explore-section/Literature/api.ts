import { generativeQADTO } from './utils/DTOs';
import * as LiteratureErrors from './errors';
import { GenerativeQAResponse, ReturnGetGenerativeQA } from '@/types/literature';
import { nexus } from '@/config';

const getGenerativeQA: ReturnGetGenerativeQA = async ({ question, session }) => {
  try {
    const response = await fetch(`${nexus.aiUrl}/generative_qa`, {
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
    return generativeQADTO({ question, generativeQAResponse });
  } catch (error: unknown) {
    console.error('@@getGenerativeQA - error ', error);
    if (error instanceof LiteratureErrors.LiteratureValidationError) {
      throw new LiteratureErrors.LiteratureValidationError(error.detail);
    }
    throw new Error((error as Error).message);
  }
};

export { getGenerativeQA };
