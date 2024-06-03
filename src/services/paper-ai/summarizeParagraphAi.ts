// import { AI_ROOT_API } from "./expandParagraphAi";

// export default async function handleAiSummarizeParagraph(text: string): Promise<string> {
//   const response = await fetch(AI_ROOT_API, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     method: 'POST',
//     body: JSON.stringify({
//       prompt: text,
//       n_predict: 512,
//     }),
//   });

//   if(response.ok){
//     return await response.text();
//   }
//   throw new Error('Ai summarize paragraph failed');
// }

export default async function handleAiSummarizeParagraph(originalText: string): Promise<string> {
  const summaryTemplates = [
    'In short, this paragraph discusses...',
    'The main point of this paragraph is...',
    'To summarize, the paragraph highlights...',
    'In summary, the author argues that...',
    'This paragraph can be condensed to the idea that...',
  ];

  const keyPhrases = [
    'key points',
    'central idea',
    'main argument',
    'core concept',
    'primary focus',
  ];

  const randomTemplate = summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)];
  const randomPhrase = keyPhrases[Math.floor(Math.random() * keyPhrases.length)];

  const firstFewWords = originalText.split(' ').slice(0, 5).join(' ');

  return `${randomTemplate} ${firstFewWords}... and its ${randomPhrase}.`;
}
