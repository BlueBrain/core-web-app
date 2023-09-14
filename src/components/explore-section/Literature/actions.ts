'use server';

import { getServerSession } from 'next-auth';

import { fetchArticleTypes, getGenerativeQA } from './api';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { ArticleTypeSuggestion } from '@/types/literature';

export async function getGenerativeQAAction({
  data,
  keywords,
  fromDate,
  endDate,
  journals,
  authors,
  articleTypes,
}: {
  data: FormData;
  keywords?: string[];
  journals?: string[];
  authors?: string[];
  articleTypes?: string[];
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
    authors,
    articleTypes,
  });
  return generativeQA;
}

export async function getArticleTypes(): Promise<ArticleTypeSuggestion[]> {
  const session = await getServerSession(authOptions);

  const articleTypeResponse = await fetchArticleTypes(session?.accessToken ?? '');

  return articleTypeResponse.map((articleResponse) => ({
    articleType: articleResponse.article_type,
    docCount: articleResponse.docs_in_db,
  }));
}
