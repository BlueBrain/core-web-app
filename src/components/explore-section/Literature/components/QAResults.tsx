'use client';

import React, { useEffect, useMemo, useRef} from 'react';
import { useAtomValue } from 'jotai';
import { literatureAtom, literatureResultAtom } from '../state';
import QASingleResult from './QASingleResult';


function QAResultList() {
  const QAs = useAtomValue(literatureResultAtom);
  const { selectedBrainRegion, selectAllQuestions } = useAtomValue(literatureAtom);

  const DisplayedQAs = useMemo(() => {
    if (!selectedBrainRegion || selectAllQuestions) return QAs
    return QAs.filter(qa => qa.brainRegion?.id === selectedBrainRegion.id);
  }, [QAs, selectedBrainRegion, selectAllQuestions]);
  
  return (
    <div className='flex-1 w-full overflow-auto'>
      <ul className="flex flex-col items-center justify-center max-w-4xl mx-auto list-none">
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
  )
}

function QAResultListScrollable() {
  const qaResultsRef = useRef<HTMLDivElement>(null);
  const QAs = useAtomValue(literatureResultAtom);

  useEffect(() => {
    if (qaResultsRef.current) {
      qaResultsRef.current.scrollTo({
        behavior: 'smooth',
        top: qaResultsRef.current.scrollHeight,
      });
    }
  }, [QAs.length]);
  
  return (
    <div className='w-full max-h-screen overflow-y-scroll scroll-smooth' ref={qaResultsRef}>
      <QAResultList />
    </div>
  );
}

export default QAResultListScrollable;
