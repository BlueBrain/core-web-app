'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { literatureAtom, literatureResultAtom, useLiteratureAtom } from '../state';
import QASingleResult from './QASingleResult';

function QAResultList() {
  const QAs = useAtomValue(literatureResultAtom);
  const { selectedBrainRegion, selectAllQuestions } = useAtomValue(literatureAtom);

  const DisplayedQAs = useMemo(() => {
    if (!selectedBrainRegion || selectAllQuestions) return QAs;
    return QAs.filter((qa) => qa.brainRegion?.id === selectedBrainRegion.id);
  }, [QAs, selectedBrainRegion, selectAllQuestions]);

  return (
    <div className="flex-1 w-full h-full overflow-auto">
      <ul className="flex flex-col items-center justify-start max-w-4xl p-4 mx-auto list-none">
        {DisplayedQAs.map(({ id, question, answer, rawAnswer, articles, askedAt }) => (
          <QASingleResult
            key={id}
            {...{
              id,
              askedAt,
              question,
              answer,
              rawAnswer,
              articles,
            }}
          />
        ))}
      </ul>
    </div>
  );
}

function QAResultListScrollable() {
  const firstRender = useRef(false);
  const qaResultsRef = useRef<HTMLDivElement>(null);
  const QAs = useAtomValue(literatureResultAtom);
  const update = useLiteratureAtom();

  useEffect(() => {
    if (qaResultsRef.current) {
      qaResultsRef.current.scrollTo({
        behavior: 'smooth',
        top: qaResultsRef.current.scrollHeight,
      });
    }
  }, [QAs.length]);

  useEffect(() => {
    // set the active question to the last question just in the first reneder
    if (QAs.length > 0 && !firstRender.current) {
      update('activeQuestionId', QAs[QAs.length - 1].id);
      firstRender.current = true;
    }
  }, [QAs, update, firstRender]);

  return (
    <div className="w-full h-full max-h-screen overflow-y-scroll scroll-smooth" ref={qaResultsRef}>
      <QAResultList />
    </div>
  );
}

export default QAResultListScrollable;
