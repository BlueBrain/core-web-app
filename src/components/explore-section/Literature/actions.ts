'use server';

import { getGenerativeQA } from './api';

export async function getGenerativeQAAction(data: FormData) {
  const question = data.get('gqa-question') as string;
  const generativeQA = await getGenerativeQA({ question });
  return generativeQA;
}
