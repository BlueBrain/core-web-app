import { useAtomValue } from 'jotai';
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';

import {
  brainRegionQAs,
  literatureResultAtom,
  useContextualLiteratureResultAtom,
} from '@/state/literature';
import { GenerativeQA } from '@/types/literature';
import usePathname from '@/hooks/pathname';

function useContextualLiteratureContext() {
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const allQAs = useAtomValue(literatureResultAtom);
  const brainRegionSpecificQAs = useAtomValue(brainRegionQAs);
  const { QAs: contextualQAs } = useContextualLiteratureResultAtom();

  const currentMode = searchParams?.get('context');
  const isOptionsMode = searchParams?.get('context') === 'more-options';
  const isAskMoreMode = searchParams?.get('context') === 'ask-more';
  const selectedQuestion = searchParams?.get('context-question');

  const isBuildSection = pathname?.startsWith('/build');
  const isContextualLiterature = isAskMoreMode || isOptionsMode;

  let dataSource: GenerativeQA[] = [];
  if (isContextualLiterature) {
    dataSource = contextualQAs;
  } else if (isBuildSection) {
    dataSource = brainRegionSpecificQAs;
  } else {
    dataSource = allQAs;
  }

  const clearContextSearchParams = (Params: ReadonlyURLSearchParams = searchParams) => {
    const params = new URLSearchParams(Array.from(Params.entries()));
    Array.from(params.entries()).forEach(([key]) => {
      if (key.includes('context')) {
        params.delete(key);
      }
    });
    return params;
  };

  return {
    pathname,
    currentMode,
    isOptionsMode,
    isAskMoreMode,
    selectedQuestion,
    dataSource,
    isBuildSection,
    isContextualLiterature,
    clearContextSearchParams,
  };
}

export default useContextualLiteratureContext;
