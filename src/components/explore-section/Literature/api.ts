import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { GenerativeQAResponse, ReturnGetGenerativeQA } from './types';
import { generativeQADTO } from './utils/DTOs';
import * as LiteratureErrors from './errors';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { nexus } from '@/config';

const getGenerativeQA: ReturnGetGenerativeQA = async ({ question }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/api/auth/signin');
  }
  try {
    const response = await fetch(`${nexus.aiUrl}/generative_qa`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        query: question,
      }),
    });
    const generativeQAResponse = (await response.json()) as GenerativeQAResponse;
    return generativeQADTO({ question, generativeQAResponse });
  } catch (error: unknown) {
    if (error instanceof LiteratureErrors.LiteratureValidationError) {
      throw new LiteratureErrors.LiteratureValidationError(error.detail);
    }
    throw new Error((error as Error).message);
  }
};

export { getGenerativeQA };
