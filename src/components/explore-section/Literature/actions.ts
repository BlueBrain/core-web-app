'use server';

import { getServerSession } from 'next-auth';

import { getGenerativeQA } from './api';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function getGenerativeQAAction({
  data,
  keywords,
  fromDate,
  endDate,
  journals,
}: {
  data: FormData;
  keywords?: string[];
  journals?: string[];
  fromDate?: string;
  endDate?: string;
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
  });
  return generativeQA;
}
