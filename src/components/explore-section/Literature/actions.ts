'use server';

import { getServerSession } from 'next-auth';

import { getGenerativeQA } from './api';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function getGenerativeQAAction({
  data,
  keywords,
}: {
  data: FormData;
  keywords?: string[];
}) {
  const session = await getServerSession(authOptions);
  const question = String(data.get('gqa-question'));
  const generativeQA = await getGenerativeQA({ question, keywords, session });
  return generativeQA;
}
