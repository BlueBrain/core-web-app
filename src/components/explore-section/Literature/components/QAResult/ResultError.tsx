import { useReducer } from 'react';
import { useSetAtom } from 'jotai';
import { Button } from 'antd';
import delay from 'lodash/delay';
import reject from 'lodash/reject';

import ResultContainer from './ResultContainer';
import ResultHeader from './ResultHeader';
import { literatureResultAtom, persistedLiteratureResultAtom } from '@/state/literature';
import { FailedGenerativeQA } from '@/types/literature';
import { classNames } from '@/util/utils';

export type ResultErrorProps = Omit<FailedGenerativeQA, 'isNotFound'>;

const GENERATIVE_QA_ERRORS_MAP: { [key: string]: string } = {
  '1': 'Unfortunately, no relevant information could be found in our database.\n Please modify your request.',
  '2': 'Unfortunately, no relevant information could be found in our database.\n Please modify your request.',
  '3': "It seems there is an error.\n Try adjusting your request.\n If the issue persists, it's likely a glitch on our end.\n Please submit your question using the “feedback” button.",
  '4': "It seems there is an error.\n Try adjusting your request.\n If the issue persists, it's likely a glitch on our end.\n Please submit your question using the “feedback” button.",
  '5': "We're currently experiencing high demand, which is affecting our service.\n Please attempt your request again later.",
  '6': "We apologize, but we couldn't provide a complete answer to your question.\n This may be due to a problem on our side.\n Please try your request again later.",
  default: 'An unexpected error has occurred.\n Please try your request again later.',
};

export default function ResultError({
  askedAt,
  id,
  question,
  brainRegion,
  statusCode,
  showHeader = true,
  showRemoveBtn = true,
}: ResultErrorProps & { showHeader?: boolean; showRemoveBtn?: boolean }) {
  const updatePersistedResults = useSetAtom(persistedLiteratureResultAtom);
  const updateResults = useSetAtom(literatureResultAtom);
  const [collpaseQuestion, toggleCollapseQuestion] = useReducer((val) => !val, false);
  const [deletingPending, toggleDelete] = useReducer((val) => !val, false);

  const onDelete = () => {
    toggleDelete();
    delay(() => {
      updateResults((prev) => reject(prev, { id }));
      updatePersistedResults((prev) => reject(prev, { id }));
    }, 1000);
  };

  return (
    <ResultContainer
      id={id}
      moreSpace={collpaseQuestion}
      className={classNames(deletingPending ? 'animate-scale-down' : '')}
    >
      <>
        {showHeader && (
          <ResultHeader
            {...{
              question,
              askedAt,
              brainRegion,
              collpaseQuestion,
              toggleCollapseQuestion,
            }}
          />
        )}
        <div
          className={classNames(
            'flex flex-col items-start justify-center w-full gap-y-1 max-h-max',
            collpaseQuestion ? 'hidden' : 'block'
          )}
        >
          <div className="bg-orange-50 w-full px-5 py-4 flex flex-col items-center justify-center">
            <p className="w-full mb-px text-base font-medium text-center text-amber-500 whitespace-pre-line">
              {GENERATIVE_QA_ERRORS_MAP[statusCode as keyof typeof GENERATIVE_QA_ERRORS_MAP] ??
                GENERATIVE_QA_ERRORS_MAP.default}
            </p>
            {showRemoveBtn && (
              <Button
                type="default"
                className="bg-transparent rounded-none mt-4 text-amber-500 font-bold hover:!border-amber-500 hover:!text-amber-500"
                onClick={onDelete}
              >
                Remove question
              </Button>
            )}
          </div>
        </div>
      </>
    </ResultContainer>
  );
}
