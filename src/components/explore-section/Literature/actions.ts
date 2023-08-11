'use server';

import { getServerSession } from 'next-auth';

import { getGenerativeQA } from './api';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function getGenerativeQAAction(data: FormData) {
  const session = await getServerSession(authOptions);
  const question = data.get('gqa-question') as string;
  const generativeQA = await getGenerativeQA({ question, session });
  return generativeQA;
}
