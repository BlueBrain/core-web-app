'use server';

import { getServerSession } from 'next-auth';

import { GenerativeQAPayload, getGenerativeQA } from './api';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function getGenerativeQAAction({
  data,
  keywords,
  fromDate,
  endDate,
  journals,
  authors,
  articleTypes,
  useKeywords,
}: GenerativeQAPayload & {
  data: FormData;
}) {
  const session = await getServerSession(authOptions);
  const question = String(data.get('gqa-question'));
  const generativeQA = await getGenerativeQA({
    question,
    keywords,
    session,
    fromDate,
    endDate,
    journals,
    authors,
    articleTypes,
    useKeywords,
  });
  return generativeQA;
}
