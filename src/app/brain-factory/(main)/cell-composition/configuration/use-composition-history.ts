import { useCallback, useMemo } from 'react';
import { useAtom, useSetAtom } from 'jotai/react';
import { atom } from 'jotai/vanilla';

import { Composition } from '@/types/atlas';
import { setCompositionAtom } from '@/state/brain-factory/brain-regions';

const compositionHistoryAtom = atom<Composition[]>([]);
const compositionHistoryIndexAtom = atom<number>(0);

export default function useCompositionHistory() {
  const setComposition = useSetAtom(setCompositionAtom);
  const [compositionHistory, setCompositionHistory] = useAtom(compositionHistoryAtom);
  const [historyIndex, setHistoryIndex] = useAtom(compositionHistoryIndexAtom);

  const appendToHistory = useCallback(
    (newComposition: Composition) => {
      // We clone the composition to get a completely new object
      const compositionClone = structuredClone(newComposition);
      const newHistory = [...compositionHistory.slice(0, historyIndex + 1), compositionClone];
      setCompositionHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [compositionHistory, setCompositionHistory, setHistoryIndex, historyIndex]
  );

  const resetHistory = useCallback(
    (currentComposition: Composition) => {
      setCompositionHistory([structuredClone(currentComposition)]);
      setHistoryIndex(0);
    },
    [setCompositionHistory, setHistoryIndex]
  );

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
    appendToHistory,
    resetHistory,
    resetComposition,
    undoComposition,
    redoComposition,
    historyCount,
    historyIndex,
    canUndo,
    canRedo,
  };
}
