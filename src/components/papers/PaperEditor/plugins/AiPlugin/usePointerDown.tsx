import { useEffect, useRef, useState } from 'react';

export default function usePointerDown(elt: HTMLElement | null) {
  const ref = useRef(elt);
  const [{ isPointerDown, isPointerReleased }, setPointerState] = useState({
    isPointerDown: false,
    isPointerReleased: true,
  });

  useEffect(() => {
    const eltRef = ref.current;
    const handlePointerUp = () => {
      setPointerState({ isPointerDown: false, isPointerReleased: true });
      eltRef?.removeEventListener('pointerup', handlePointerUp);
    };

    const handlePointerDown = () => {
      setPointerState({ isPointerDown: true, isPointerReleased: false });
      eltRef?.addEventListener('pointerup', handlePointerUp);
    };

    eltRef?.addEventListener('pointerdown', handlePointerDown);

    return () => {
      if (eltRef) {
        eltRef.removeEventListener('pointerdown', handlePointerDown);
      }
    };
  }, [ref]);

  return { isPointerDown, isPointerReleased };
}
