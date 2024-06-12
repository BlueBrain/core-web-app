import { bbsMlBaseUrl } from '@/config';

export default async function handleAiSummarizeParagraph(text: string): Promise<string> {
  const response = await fetch(`${bbsMlBaseUrl}/qa/passthrough`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      query: `
        Summarize the following text ${text} concisely, capturing the main points and key details:
      `,
    }),
  });

  if (response.ok) {
    return (await response.json()).answer;
  }
  throw new Error('Ai summarize paragraph failed');
}
