import { useAtomValue } from 'jotai';
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';

import { brainRegionQAs, literatureResultAtom } from '@/state/literature';
import { GenerativeQA } from '@/types/literature';
import { destructPath } from '@/components/build-section/ContextualLiterature/util';
import usePathname from '@/hooks/pathname';

/// NOTE: make sure to remove "chatId" from the query params in the url if return back from literature to the config/interactive pages
/// back to configuration as an example, @dinika

function useContextualLiteratureContext() {
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const allQAs = useAtomValue(literatureResultAtom);
  const brainRegionSpecificQAs = useAtomValue(brainRegionQAs);

  const currentMode = searchParams?.get('context');
  const chatId = searchParams?.get('chatId');
  const isOptionsMode = searchParams?.get('context') === 'more-options';
  const isAskMoreMode = searchParams?.get('context') === 'ask-more';
  const isContextualLiterature = searchParams?.get('contextual') === 'true';
  const selectedQuestion = searchParams?.get('context-question');

  const isBuildSection = pathname?.startsWith('/build');
  const isContextualMode = isAskMoreMode || isOptionsMode;

  let dataSource: GenerativeQA[] = [];
  if (isContextualLiterature) {
    dataSource = allQAs.filter(({ chatId: questionChatId }) => questionChatId === chatId);
  } else if (isBuildSection) {
    dataSource = brainRegionSpecificQAs;
  } else {
    dataSource = allQAs;
  }

  const clearContextSearchParams = (
    Params: ReadonlyURLSearchParams = searchParams,
    clearChat?: boolean
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

  const { step: buildStep } = destructPath(pathname!);
  return {
    buildStep,
    pathname,
    currentMode,
    isOptionsMode,
    isAskMoreMode,
    selectedQuestion,
    dataSource,
    isBuildSection,
    isContextualLiterature,
    isContextualMode,
    clearContextSearchParams,
    removeContextualSearchParam,
    appendContextualSearchParam,
  };
}

export default useContextualLiteratureContext;
