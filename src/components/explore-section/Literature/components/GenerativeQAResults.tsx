'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';

import { useLiteratureDataSource } from '../useContextualLiteratureContext';
import withStreamResult from './QAResult/ResultWithStream';
import { literatureAtom } from '@/state/literature';

function AlwaysScrollToBottom() {
  const { answer } = useAtomValue(literatureAtom);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && answer !== '') ref.current?.scrollIntoView(false);
  }, [answer]);

  return <div aria-hidden ref={ref} />;
}

export default function QAResultList() {
  const dataSource = useLiteratureDataSource();
  const { areQAParamsVisible } = useAtomValue(literatureAtom);

  const qaListRef = useCallback(
    (node: HTMLDivElement) => {
      if (node && dataSource) {
        node.scrollTo({
          behavior: 'auto',
          top: node.scrollHeight,
        });
      }
    },
    [dataSource]
  );

  return (
    <div
      id="result-container"
      className="w-full h-full max-h-screen transition-height duration-700 ease-linear"
    >
      <div
        ref={qaListRef}
        className="flex-1 w-full overflow-auto scroll-auto primary-scrollbar"
        style={{
          height: `calc(100% - ${areQAParamsVisible ? '31.5rem' : '10.5rem'})`,
        }}
      >
        <ul className="flex flex-col items-center justify-start max-w-4xl w-full p-4 mx-auto list-none">
          {dataSource.map(({ id, ...rest }) =>
            withStreamResult({
              id,
              current: rest,
            })
          )}
        </ul>
        <AlwaysScrollToBottom />
      </div>
    </div>
  );
}
