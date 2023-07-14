'use client';

import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { useAtomValue } from 'jotai';

import PlotRenderer from './PlotRenderer';
import { mModelPreviewConfigAtom } from '@/state/brain-model-config/cell-model-assignment/m-model';
import sessionAtom from '@/state/session';
import { SynthesisPreviewInterface, SynthesisPreviewApiPlotResponse } from '@/types/m-model';
import { classNames } from '@/util/utils';
import { selectedMModelIdAtom } from '@/state/brain-model-config/cell-model-assignment';
import { synthesisPreviewApiUrl } from '@/constants/cell-model-assignment/m-model';

type Props = {
  className?: string;
};

async function getImages(config: SynthesisPreviewInterface, token: string) {
  const response = await fetch(synthesisPreviewApiUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Nexus-Token': token,
    },
    body: JSON.stringify(config),
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

  const getImagesDebounced = useCallback(
    debounce(async (config: SynthesisPreviewInterface, token: string) => {
      const imgs = await getImages(config, token);
      setImgSources({
        barcode: { src: imgs.barcode },
        diagram: { src: imgs.diagram },
        image: { src: imgs.image },
        synthesis: { src: imgs.synthesis },
      });
      setIsLoading(false);
    }, 500),
    []
  );

  useEffect(() => {
    if (!mModelPreviewConfig || !session) return;
    setIsLoading(true);
    getImagesDebounced(mModelPreviewConfig, session.accessToken);
  }, [mModelPreviewConfig, session, getImagesDebounced, selectedMModelId]);

  const isLoadingStyle = isLoading ? 'opacity-50' : '';

  return (
    <div className={className}>
      <div className={classNames('flex flex-col w-1/2', isLoadingStyle)}>
        <PlotRenderer plotResponse={imgSources} plotName="barcode" title="Persistence barcode" />
        <PlotRenderer plotResponse={imgSources} plotName="diagram" title="Persistence diagram" />
        <PlotRenderer plotResponse={imgSources} plotName="image" title="Persistence image" />
      </div>

      <div className={classNames('w-1/2', isLoadingStyle)}>
        <PlotRenderer plotResponse={imgSources} plotName="synthesis" title="Synthesis / test h5" />
      </div>
      {isLoading && (
        <div className="absolute flex w-full h-full items-center justify-center text-primary-8 text-2xl">
          Fetching data...
        </div>
      )}
    </div>
  );
}
