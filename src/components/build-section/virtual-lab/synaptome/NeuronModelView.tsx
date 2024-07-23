import { useCallback, useEffect, useRef } from 'react';
import Renderer from '@/services/bluenaas-single-cell/renderer';
import { Morphology } from '@/services/bluenaas-single-cell/types';
import { getSession } from '@/authFetch';
import { blueNaasUrl } from '@/config';

type Props = {
  modelSelfUrl: string;
};

export default function NeuronModelView({ modelSelfUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);

  const onLoad = useCallback((morphology: Morphology) => {
    if (rendererRef.current) {
      const prunedMorph = rendererRef.current.removeNoDiameterSection(morphology);
      rendererRef.current.addMorphology(prunedMorph);
    }
  }, []);

  useEffect(() => {
    async function readMorphology(): Promise<Morphology> {
      const session = await getSession();
      const response = await fetch(
        `${blueNaasUrl}/morphology?model_id=${encodeURIComponent(modelSelfUrl)}`,
        {
          method: 'get',
          headers: {
            accept: 'application/x-ndjson',
            authorization: `bearer ${session.accessToken}`,
          },
        }
      );
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
    }

    if (!rendererRef.current && containerRef.current) {
      rendererRef.current = new Renderer(containerRef.current, {});
      (async () => {
        const morphology = await readMorphology();
        onLoad(morphology);
      })();
    }
  }, [modelSelfUrl, onLoad]);

  return (
    <div className="relative h-full w-full">
      <div className="h-screen" ref={containerRef} />
    </div>
  );
}
