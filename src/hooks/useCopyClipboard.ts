import { useCallback, useState } from 'react';

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>;
type ResetFn = () => void;

export function useCopyToClipboard(): [CopiedValue, CopyFn, ResetFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = useCallback(async (text) => {
    if (!navigator.clipboard) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      setCopiedText(null);
      return false;
    }
  }, []);

  const reset = () => {
    setCopiedText(null);
  };

  return [copiedText, copy, reset];
}
