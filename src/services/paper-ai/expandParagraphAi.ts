export const AI_ROOT_API = 'http://bbp.courcol.ch:8080/completion';

// export default async function handleAiExpandParagraph(text: string): Promise<string> {
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
//   throw new Error('Ai expand paragraph failed');
// }

export default function handleAiExpandParagraph(originalText: string) {
  const baseSentences = [
    'This paragraph delves deeper into the topic of...',
    "Furthermore, it's important to consider that...",
    'Expanding on the previous point...',
    'Additionally, the author elaborates on...',
    'To provide more context, we can add that...',
  ];

  const additionalDetails = [
    'historical significance of this concept.',
    'practical applications in various fields.',
    'potential implications for future developments.',
    'underlying scientific principles.',
    'ethical considerations surrounding this issue.',
  ];

  const randomBase = baseSentences[Math.floor(Math.random() * baseSentences.length)];
  const randomDetail = additionalDetails[Math.floor(Math.random() * additionalDetails.length)];

  return `${originalText} ${randomBase} ${randomDetail}`;
}
