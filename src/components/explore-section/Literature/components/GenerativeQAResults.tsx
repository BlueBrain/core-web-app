'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';

import { useLiteratureDataSource } from '../useContextualLiteratureContext';
import withStreamResult from './QAResult/ResultWithStream';
import { literatureAtom } from '@/state/literature';

function AlwaysScrollToBottom() {
  const { scrollToBottom } = useAtomValue(literatureAtom);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && scrollToBottom) {
      ref.current?.scrollIntoView(false);
    }
  }, [scrollToBottom]);

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
      className="h-full max-h-screen w-full transition-height duration-700 ease-linear"
    >
      <div
        ref={qaListRef}
        className="primary-scrollbar w-full flex-1 overflow-auto scroll-auto"
        style={{
          height: `calc(100% - ${areQAParamsVisible ? '24rem' : '10.5rem'})`,
        }}
      >
        <ul className="mx-auto flex w-full max-w-4xl list-none flex-col items-center justify-start p-4">
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
