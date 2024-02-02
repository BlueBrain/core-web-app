import { useAtomValue } from 'jotai';
import isNil from 'lodash/isNil';
import trim from 'lodash/trim';

import useStreamGenerative, { ResultWithoutId } from '../../useStreamGenerative';
import ResultCompact from './ResultCompact';
import ResultError from './ResultError';
import ResultSuccess from './ResultSuccess';
import { GenerativeQA } from '@/types/literature';
import { literatureAtom } from '@/state/literature';

function ResultOnStreamAnswer() {
  const { answer } = useAtomValue(literatureAtom);

  return (
    <div className="flex w-full items-start text-xl font-normal leading-7 text-blue-900">
      {answer}
    </div>
  );
}

// Component used to receive the stream result
export function ResultOnStream({
  id,
  scoped = false,
  onAfterStream,
  result,
}: {
  id: string;
  scoped?: boolean;
  onAfterStream?: (result: GenerativeQA) => void;
  result: ResultWithoutId;
}) {
  useStreamGenerative({
    id,
    scoped,
    onAfterStream,
    itemData: result,
  });

  return (
    <Result
      {...{
        id,
        scoped,
        result,
      }}
    >
      <ResultOnStreamAnswer />
    </Result>
  );
}

// Result component is either one of the 3
// 1. Error when no answer generated
// 2. Success compact output for contextuel literature
// 3. Success full output for normal literture
function Result({
  id,
  scoped,
  result,
  children,
}: {
  id: string;
  scoped?: boolean;
  result: ResultWithoutId;
  children: React.ReactNode;
}) {
  const { askedAt, isNotFound, question, streamed, brainRegion, chatId } = result;

  if (result.isNotFound) {
    return (
      <ResultError
        key={id}
        showHeader={!scoped}
        showRemoveBtn={!scoped}
        statusCode={result.statusCode}
        details={result.details}
        {...{
          id,
          askedAt,
          isNotFound,
          question,
          streamed,
          brainRegion,
          chatId,
        }}
      />
    );
  }

  return scoped ? (
    <ResultCompact
      key={id}
      articles={result.articles}
      rawAnswer={result.rawAnswer}
      {...{
        id,
        askedAt,
        isNotFound,
        question,
        streamed,
        brainRegion,
        chatId,
      }}
    >
      {children}
    </ResultCompact>
  ) : (
    <ResultSuccess
      key={id}
      articles={result.articles}
      rawAnswer={result.rawAnswer}
      {...{
        id,
        askedAt,
        isNotFound,
        question,
        streamed,
        brainRegion,
        chatId,
      }}
    >
      {children}
    </ResultSuccess>
  );
}

// the HOC is to build the right result component
// either will be an old result then we do not have to start the
// stream generative api or it will be a new entry then trigger the stream
export default function withStreamResult({
  id,
  scoped = false,
  onAfterStream,
  current,
}: {
  id: string;
  scoped?: boolean;
  onAfterStream?: (result: GenerativeQA) => void;
  current: ResultWithoutId;
}) {
  if (current.streamed || isNil(current.streamed)) {
    let finalAnswer = '';
    if (!current.isNotFound) {
      const { answer, rawAnswer } = current;
      if (answer && trim(answer).length > 0) {
        finalAnswer = answer;
      } else if (rawAnswer && trim(rawAnswer).length > 0) {
        finalAnswer = rawAnswer;
      }
    }
    return (
      <Result key={id} {...{ id, scoped }} result={current}>
        <div className="w-full text-xl font-normal leading-7 text-blue-900">{finalAnswer}</div>
      </Result>
    );
  }
  return (
    <ResultOnStream
      key={id}
      {...{
        id,
        scoped,
        onAfterStream,
        result: current,
      }}
    />
  );
}
