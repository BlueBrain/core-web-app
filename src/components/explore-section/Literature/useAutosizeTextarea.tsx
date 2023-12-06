import { useEffect } from 'react';

export default function useAutosizeTextArea(
  textAreaRef: HTMLTextAreaElement | null,
  value: string
) {
  useEffect(() => {
    if (textAreaRef) {
      textAreaRef.style.setProperty('height', 'auto');
      textAreaRef.style.setProperty('height', `${textAreaRef.scrollHeight}px`);
    }
  }, [textAreaRef, value]);
}
