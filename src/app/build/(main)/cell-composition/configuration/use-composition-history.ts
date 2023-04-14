import { useCallback, useMemo } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { setCompositionAtom } from '@/state/build-composition';
import {
  compositionHistoryAtom,
  compositionHistoryIndexAtom,
} from '@/state/build-composition/composition-history';

export default function useCompositionHistory() {
  const setComposition = useSetAtom(setCompositionAtom);
  const [compositionHistory, setCompositionHistory] = useAtom(compositionHistoryAtom);
  const [historyIndex, setHistoryIndex] = useAtom(compositionHistoryIndexAtom);

  const resetComposition = useCallback(() => {
    if (!compositionHistory.length) return;

    const freshComposition = structuredClone(compositionHistory[0]);
    const newHistory = [structuredClone(freshComposition)];
    setComposition(freshComposition);
    setCompositionHistory(newHistory);
    setHistoryIndex(0);
  }, [compositionHistory, setCompositionHistory, setHistoryIndex, setComposition]);

  const undoComposition = useCallback(() => {
    let newIndex = historyIndex;
    if (historyIndex > 0) {
      newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
    }
    setComposition(structuredClone(compositionHistory[newIndex]));
  }, [historyIndex, compositionHistory, setComposition, setHistoryIndex]);

  const redoComposition = useCallback(() => {
    let newIndex = historyIndex;
    if (historyIndex + 1 < compositionHistory.length) {
      newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
    }
    setComposition(structuredClone(compositionHistory[newIndex]));
  }, [historyIndex, compositionHistory, setComposition, setHistoryIndex]);

  const historyCount = useMemo(() => compositionHistory.length, [compositionHistory]);

  const canUndo = useMemo(() => historyCount > 1 && historyIndex > 0, [historyCount, historyIndex]);

  const canRedo = useMemo(
    () => historyCount > 1 && historyIndex + 1 < historyCount,
    [historyIndex, historyCount]
  );

  return {
    resetComposition,
    undoComposition,
    redoComposition,
    historyCount,
    historyIndex,
    canUndo,
    canRedo,
  };
}
