'use client';

import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

import PlotRenderer from './PlotRenderer';
import {
  mModelPreviewConfigAtom,
  selectedMModelIdAtom,
} from '@/state/brain-model-config/cell-model-assignment/m-model';
import sessionAtom from '@/state/session';
import { SynthesisPreviewInterface, SynthesisPreviewApiPlotResponse } from '@/types/m-model';
import { classNames } from '@/util/utils';
import { synthesisUrl } from '@/config';
import { useDebouncedCallback } from '@/hooks/hooks';

type Props = {
  className?: string;
};

const debounceDelay = 500;

async function getImages(config: SynthesisPreviewInterface, token: string, fetchOptions = {}) {
  const response = await fetch(synthesisUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Nexus-Token': token,
    },
    body: JSON.stringify(config),
    ...fetchOptions,
  });

  if (!response.ok) {
    throw new Error('failed to fetch preview images');
  }

  return response.json();
}

export default function SynthesisPreview({ className }: Props) {
  const session = useAtomValue(sessionAtom);
  const mModelPreviewConfig = useAtomValue(mModelPreviewConfigAtom);
  const [imgSources, setImgSources] = useState<SynthesisPreviewApiPlotResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const selectedMModelId = useAtomValue(selectedMModelIdAtom);

  const getImagesDebounced = useDebouncedCallback(
    async (abortController: AbortController, config: SynthesisPreviewInterface, token: string) => {
      setIsLoading(true);
      try {
        const imgs = await getImages(config, token, {
          signal: abortController.signal,
        });
        setImgSources({
          barcode: { src: imgs.barcode },
          diagram: { src: imgs.diagram },
          image: { src: imgs.image },
          synthesis: { src: imgs.synthesis },
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          // Handle any error not caused by the Abort Controller aborting the request
          throw new Error(`Error using preview synthesis API ${err}`);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [],
    debounceDelay
  );

  useEffect(() => {
    if (!mModelPreviewConfig || !session) return undefined;
    if (Object.keys(mModelPreviewConfig.resources).length === 0) return undefined;

    setIsLoading(true);
    const abortController = new AbortController();
    getImagesDebounced(abortController, mModelPreviewConfig, session.accessToken);

    return () => {
      abortController.abort();
    };
  }, [mModelPreviewConfig, session, getImagesDebounced, selectedMModelId]);

  const isLoadingStyle = isLoading ? 'opacity-50' : '';

  return (
    <div className={className}>
      <div className={classNames('flex w-1/2 flex-col', isLoadingStyle)}>
        <PlotRenderer plotResponse={imgSources} plotName="barcode" title="Persistence barcode" />
        <PlotRenderer plotResponse={imgSources} plotName="diagram" title="Persistence diagram" />
        <PlotRenderer plotResponse={imgSources} plotName="image" title="Persistence image" />
      </div>

      <div className={classNames('w-1/2', isLoadingStyle)}>
        <PlotRenderer plotResponse={imgSources} plotName="synthesis" title="Synthesized neuron" />
      </div>
      {isLoading && (
        <div className="absolute flex h-full w-full items-center justify-center text-2xl text-primary-8">
          Fetching data...
        </div>
      )}
    </div>
  );
}
