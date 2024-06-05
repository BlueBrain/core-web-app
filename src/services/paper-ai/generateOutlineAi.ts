import { env } from '@/env.mjs';

export default async function generateOutlineAi(
  title: string,
  description: string
): Promise<string> {
  const response = await fetch(`${env.NEXT_PUBLIC_BBS_ML_BASE_URL}/qa/passthrough`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      query: `
        Generate a detailed publication outline in markdown format using the provided title ${title} and description ${description}.
        Ensure the outline includes appropriate headings and subheadings to comprehensively structure the content of the paper.
      `,
    }),
  });

  if (response.ok) {
    return (await response.json()).answer;
  }
  throw new Error('Ai paper generate outline failed');
}
