'use client';

import { useEffect, useImperativeHandle, useRef } from 'react';
import delay from 'lodash/delay';

import useContextualLiteratureContext from '../useContextualLiteratureContext';
import GenerativeQASingleResultError from './QAResult/QASingleResultError';
import GenerativeQASingleResult from './QAResult/QASingleResult';
import { SucceededGenerativeQA, FailedGenerativeQA } from '@/types/literature';

export default function QAResultList({
  imperativeRef,
}: {
  imperativeRef: React.RefObject<{ goToBottom: () => void }>;
}) {
  const qaResultsRef = useRef<HTMLDivElement>(null);
  const firstRenderRef = useRef(false);
  const { dataSource } = useContextualLiteratureContext();

  useImperativeHandle(imperativeRef, () => ({
    goToBottom() {
      delay(() => {
        if (qaResultsRef.current) {
          qaResultsRef?.current.scrollTo({
            behavior: 'smooth',
            top: qaResultsRef.current.scrollHeight,
          });
        }
      }, 500);
    },
  }));

  useEffect(() => {
    if (dataSource.length > 0 && qaResultsRef.current && !firstRenderRef.current) {
      qaResultsRef?.current.scrollTo({
        behavior: 'smooth',
        top: qaResultsRef.current.scrollHeight,
      });
      firstRenderRef.current = true;
    }
  }, [dataSource]);

  return (
    <div className="w-full h-full max-h-screen transition-height duration-700 ease-linear">
      <div className="flex-1 w-full h-full overflow-auto scroll-smooth" ref={qaResultsRef}>
        <ul className="flex flex-col items-center justify-start max-w-4xl p-4 mx-auto list-none">
          {dataSource.map(({ id, question, askedAt, brainRegion, isNotFound, ...rest }) =>
            isNotFound ? (
              <GenerativeQASingleResultError
                key={id}
                statusCode={(rest as FailedGenerativeQA).statusCode}
                details={(rest as FailedGenerativeQA).details}
                {...{
                  id,
                  question,
                  askedAt,
                  brainRegion,
                  isNotFound,
                }}
              />
            ) : (
              <GenerativeQASingleResult
                key={id}
                answer={(rest as SucceededGenerativeQA).answer}
                rawAnswer={(rest as SucceededGenerativeQA).rawAnswer}
                articles={(rest as SucceededGenerativeQA).articles}
                {...{
                  id,
                  askedAt,
                  question,
                  brainRegion,
                  isNotFound,
                }}
              />
            )
          )}
        </ul>
      </div>
    </div>
  );
}
