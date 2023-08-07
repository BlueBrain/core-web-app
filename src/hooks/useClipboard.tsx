import { useState } from 'react';
import delay from 'lodash/delay';

export interface UseClipboardProps {
  /**
   * The time in milliseconds to wait before resetting the clipboard.
   * @default 2000
   */
  timeout?: number;
}

/**
 * Copies the given text to the clipboard.
 * @param {number} timeout - timeout in ms, default 2000
 * @returns {copy, copied, error, reset} - copy function, copied state, error state, reset function
 */
function useClipboard({ timeout = 2000 }: UseClipboardProps = {}) {
  const [error, setError] = useState<Error | null>(null);
  const [copied, setCopied] = useState(false);

  const copy = async (valueToCopy: any) => {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(valueToCopy);
      delay(() => setCopied(false), timeout);
      setCopied(true);
    } else {
      delay(() => setError(null), timeout);
      setError(new Error('useClipboard: navigator.clipboard is not supported'));
    }
  };

  const reset = () => {
    setCopied(false);
    setError(null);
  };

  return { copy, reset, error, copied };
}

export type UseClipboardReturn = ReturnType<typeof useClipboard>;
export default useClipboard;
