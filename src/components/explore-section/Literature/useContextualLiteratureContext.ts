import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';

import { brainRegionQAs, literatureResultAtom } from '@/state/literature';
import { GenerativeQA } from '@/types/literature';
import usePathname from '@/hooks/pathname';

export function useLiteratureDataSource() {
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const allQAs = useAtomValue(literatureResultAtom);
  const brainRegionSpecificQAs = useAtomValue(brainRegionQAs);
  const chatId = searchParams?.get('chatId');
  const isContextualLiterature = searchParams?.get('contextual') === 'true';
  const isBuildSection = pathname?.startsWith('/build');

  return useMemo(() => {
    let dataSource: GenerativeQA[] = [];
    if (isContextualLiterature) {
      dataSource = allQAs.filter(({ chatId: questionChatId }) => questionChatId === chatId);
    } else if (isBuildSection) {
      dataSource = brainRegionSpecificQAs;
    } else {
      dataSource = allQAs;
    }

    return dataSource;
  }, [chatId, allQAs, brainRegionSpecificQAs, isBuildSection, isContextualLiterature]);
}

export function useContextSearchParams() {
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const currentMode = searchParams?.get('context');
  const chatId = searchParams?.get('chatId');
  const isOptionsMode = searchParams?.get('context') === 'more-options';
  const isAskMoreMode = searchParams?.get('context') === 'ask-more';
  const isContextualLiterature = searchParams?.get('contextual') === 'true';

  const isBuildSection = pathname?.startsWith('/build');
  const isContextualMode = isAskMoreMode || isOptionsMode;

  const clearContextSearchParams = (
    Params: ReadonlyURLSearchParams = searchParams,
    clearChat: boolean = false
  ) => {
    const params = new URLSearchParams(Array.from(Params.entries()));
    Array.from(params.entries()).forEach(([key]) => {
      if (key.includes('context')) {
        params.delete(key);
      }
      if (clearChat) {
        params.delete('chatId');
      }
    });
    return params;
  };

  const removeContextualSearchParam = (Params: ReadonlyURLSearchParams = searchParams) => {
    const params = new URLSearchParams(Array.from(Params.entries()));
    params.delete('contextual');
    return params;
  };

  const appendContextualSearchParam = (Params: ReadonlyURLSearchParams = searchParams) => {
    const params = new URLSearchParams(Array.from(Params.entries()));
    params.append('contextual', 'true');
    return params;
  };

  return {
    chatId,
    pathname,
    searchParams,
    currentMode,
    isContextualLiterature,
    isBuildSection,
    isContextualMode,
    clearContextSearchParams,
    removeContextualSearchParam,
    appendContextualSearchParam,
  };
}
