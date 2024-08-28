import { useCallback, useEffect, useRef, useState } from 'react';
import isNil from 'lodash/isNil';

import { Morphology } from '@/services/bluenaas-single-cell/types';
import { getSession } from '@/authFetch';
import { isJSON } from '@/util/utils';
import getMorphology from '@/api/bluenaas/getMorphology';

export default function useMorphology({
  modelSelfUrl,
  callback,
}: {
  modelSelfUrl: string;
  callback: (morphology: Morphology) => void;
}) {
  const mountedRef = useRef(false);
  const [loading, setLoading] = useState(false);

  const readMorphology = useCallback(async (): Promise<Morphology | null> => {
    const session = await getSession();
    if (isNil(session)) {
      throw new Error('No session found');
    }

    const response = await getMorphology({ modelId: modelSelfUrl, token: session.accessToken });
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
        if (isJSON(data)) {
          return JSON.parse(data);
        }
      }
      return null;
    }
    throw new Error('Neuron morphology could not be constructed');
  }, [modelSelfUrl]);

  useEffect(() => {
    mountedRef.current = true;

    async function start() {
      if (mountedRef.current) {
        setLoading(true);
        const morphology = await readMorphology();
        mountedRef.current = false;
        if (morphology) {
          callback(morphology);
        }
        setLoading(false);
      }
    }

    start();

    return () => {
      mountedRef.current = false;
    };
  }, [callback, readMorphology, mountedRef]);

  return { loading };
}
