import { useCallback, useEffect, useRef } from 'react';

import { Morphology } from '@/services/bluenaas-single-cell/types';
import getMorphology from '@/api/bluenaas/getMorphology';

export default function useMorphology({
  modelSelfUrl,
  callback,
}: {
  modelSelfUrl: string;
  callback: (morphology: Morphology) => void;
}) {
  const mountedRef = useRef(false);
  const readMorphology = useCallback(async (): Promise<Morphology> => {
    const response = await getMorphology({ modelId: modelSelfUrl });
    const reader = response.body?.getReader();
    let data: string = '';
    let value: Uint8Array | undefined;
    let done: boolean = false;
    const decoder = new TextDecoder();
    if (reader) {
      while (!done) {
        ({ done, value } = await reader.read());
        const decodedChunk = decoder.decode(value, { stream: true });
        data += decodedChunk;
      }
    }
    return JSON.parse(data);
  }, [modelSelfUrl]);

  useEffect(() => {
    mountedRef.current = true;

    async function start() {
      if (mountedRef.current) {
        const morphology = await readMorphology();
        mountedRef.current = false;
        callback(morphology);
      }
    }

    start();

    return () => {
      mountedRef.current = false;
    };
  }, [callback, readMorphology, mountedRef]);
}
