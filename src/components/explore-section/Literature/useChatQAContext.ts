// import { useTransition } from 'react';
// import { useAtom, useAtomValue } from 'jotai';
// import { useSearchParams } from 'next/navigation';
// import merge from 'lodash/merge';
// import find from 'lodash/find';
// import findIndex from 'lodash/findIndex';
// import unset from 'lodash/unset';

// import { ANSWER_SOURCE_SEPARATOR, STREAM_JSON_DATA_SEPARATOR_REGEX, generativeQADTO } from './utils/DTOs';
// import { getGenerativeQAAction } from './actions';
// import { GenerativeQA, GenerativeQADTO, GenerativeQAResponse } from '@/types/literature';
// import {
//   initialParameters,
//   literatureAtom,
//   literatureResultAtom,
//   questionsParametersAtom,
//   useLiteratureAtom,
//   usePermanantLiteratureResultsAtom,
// } from '@/state/literature';
// import { literatureSelectedBrainRegionAtom } from '@/state/brain-regions';
// import { formatDate } from '@/util/utils';

// function useChatQAContext({
//   afterAskCallback,
//   resetAfterAsk = true,
// }: {
//   afterAskCallback?(value: GenerativeQA | null): void;
//   resetAfterAsk?: boolean;
// }) {
//   const update = useLiteratureAtom();
//   const searchParams = useSearchParams();
//   const selectedBrainRegion = useAtomValue(literatureSelectedBrainRegionAtom);
//   const [QAs, updateResult] = useAtom(literatureResultAtom);
//   const { update: updatePResults } = usePermanantLiteratureResultsAtom();
//   const { query, } = useAtomValue(literatureAtom);
//   const [isPending, startGenerativeQATransition] = useTransition();
//   const [
//     { selectedDate, selectedJournals, selectedAuthors, selectedArticleTypes },
//     updateParameters,
//   ] = useAtom(questionsParametersAtom);

//   const onValueChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
//     update('query', value);
//   const onQuestionClear = () => update('query', '');
//   const isQuestionEmpty = query.trim().length === 0;

//   const updateEntryWithStream = ({ questionId, key, value }:
//     { key: 'answer' | 'others'; questionId: string, value: string | Partial<GenerativeQA>; }
//   ) => {
//     let question = find(QAs, o => o.id === questionId);
//     const ind = findIndex(QAs, o => o.id === questionId)
//     if (question && 'answer' in question && key === 'answer') {
//       question.answer += value;
//       return updateResult((d) => [
//         ...d.slice(0, ind),
//         question as GenerativeQA,
//         ...d.slice(ind + 1),
//       ]);
//     }
//     if (question && key === 'others' && typeof value !== 'string') {
//       question = {
//         ...question,
//         ...value,
//         isNotFound: value.isNotFound as any
//       }
//       if (!value.isNotFound) {
//         ['answer', 'rawAnswer', 'articles'].forEach(i => unset(question, i));
//       }

//       return updateResult((d) => [
//         ...d.slice(0, ind),
//         question as GenerativeQA,
//         ...d.slice(ind + 1),
//       ]);
//     }
//     return question;
//   };

//   const onComplete = async (
//     response: { stream: Response, questionId: string; question: string; } | LiteratureValidationError | null,
//     extra?: Record<string, any>
//   ) => {
//     let newGenerativeQA: GenerativeQA = Object.assign({}, {
//       extra,
//       chatId: searchParams?.get('chatId'),
//       ...(selectedBrainRegion && selectedBrainRegion.id ?
//         {
//           brainRegion: {
//             id: selectedBrainRegion.id,
//             title: selectedBrainRegion.title,
//           }
//         } : {}),
//     }) as GenerativeQA;
//     let paresedStreamResponse: GenerativeQAResponse | null = null;
//     let fullStream: string = '';
//     if (response && 'stream' in response) {
//       const { stream, questionId, question } = response;
//       if (stream && ('ok' in stream) && ('body' in stream) && stream.body) {
//         if (!stream.ok || !stream.body) {
//           throw new Error(`Error in streaming ${stream.statusText}`);
//         }
//         const reader = stream.body.getReader();
//         const decoder = new TextDecoder();
//         while (true) {
//           const { value, done, } = await reader.read();
//           if (done) break;
//           const decodedChunk = decoder.decode(value, { stream: true }).split(ANSWER_SOURCE_SEPARATOR)?.[0] ?? '';
//           fullStream += decodedChunk;
//           updateEntryWithStream({
//             questionId,
//             key: 'answer',
//             value: decodedChunk,
//           });
//         }
//         const jsonStartIndex = fullStream.search(STREAM_JSON_DATA_SEPARATOR_REGEX);
//         if (jsonStartIndex !== -1) {
//           const jsonSubstring = fullStream.substring(jsonStartIndex);
//           try {
//             paresedStreamResponse = JSON.parse(jsonSubstring);
//           } catch (error) {
//             throw new Error(`Parsing ML metadata ${error}`);
//           }
//         }
//       }
//       if (paresedStreamResponse && ('answer' in paresedStreamResponse || 'raw_answer' in paresedStreamResponse)) {
//         newGenerativeQA = merge(newGenerativeQA, generativeQADTO({
//           questionId,
//           question,
//           isNotFound: false,
//           response: paresedStreamResponse,
//         } as GenerativeQADTO));
//       } else if (paresedStreamResponse && ('detail' in paresedStreamResponse)) {
//         newGenerativeQA = merge(newGenerativeQA, generativeQADTO({
//           questionId,
//           question,
//           isNotFound: true,
//           response: paresedStreamResponse.detail,
//         } as GenerativeQADTO));
//       }

//       console.log('@@newGenerativeQA', newGenerativeQA)
//       // updateWithStream({
//       //   questionId,
//       //   question: response.question,
//       //   key: 'others',
//       //   value: newGenerativeQA
//       // });
//       updatePResults(newGenerativeQA);
//       update('activeQuestionId', newGenerativeQA.id);
//     }

//     if (resetAfterAsk) {
//       update('query', '');
//     }

//     updateParameters({ ...initialParameters });
//     return newGenerativeQA;
//   };

//   const send = async ({ questionId, question }: { questionId: string, question: string }) => {
//     const dataStream = await getGenerativeQAAction({
//       question,
//       questionId,
//       keywords: selectedBrainRegion ? [selectedBrainRegion.title] : undefined,
//       journals: selectedJournals,
//       authors: selectedAuthors,
//       articleTypes: selectedArticleTypes,
//       fromDate: selectedDate?.gte ? formatDate(selectedDate.gte as Date, 'yyyy-MM-dd') : undefined,
//       endDate: selectedDate?.lte ? formatDate(selectedDate.lte as Date, 'yyyy-MM-dd') : undefined,
//     });
//     return dataStream;
//   }

//   const ask = (extra?: Record<string, any>) => (data: FormData) => {
//     startGenerativeQATransition(async () => {
//       const result = await send(data);
//       const dto = await onComplete(result, extra);
//       afterAskCallback?.(dto);
//     });
//   };

//   console.log('@@QAs', QAs);
//   return {
//     query,
//     isQuestionEmpty,
//     isPending,
//     selectedDate,
//     selectedJournals,
//     selectedAuthors,
//     updateParameters,
//     onComplete,
//     onValueChange,
//     onQuestionClear,
//     send,
//     ask,
//     createQuestionEntry,
//   };
// }

// export type ChatQAContextHook = ReturnType<typeof useChatQAContext>;
// export default useChatQAContext;

export {};
