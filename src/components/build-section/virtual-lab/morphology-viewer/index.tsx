import { forwardRef, Ref, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Morphology } from '@/services/bluenaas-single-cell/types';
import Renderer from '@/services/bluenaas-single-cell/renderer';
import useMorphology from '@/hooks/useMorphology';

type Props = {
  modelSelfUrl: string;
  callback?: (morphology: Morphology) => void;
};

export type MorphologyViewerRef = {
  renderer: Renderer | null;
  container: HTMLDivElement | null;
  cursor: HTMLDivElement | null;
};

const MorphologyViewer = forwardRef(
  ({ modelSelfUrl, callback }: Props, ref: Ref<MorphologyViewerRef>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [rendererRef, setRenderer] = useState<Renderer | null>(null);
    const cursorHoverRef = useRef<HTMLDivElement | null>(null);

    const runRenderer = useCallback(
      (morphology: Morphology) => {
        if (containerRef.current) {
          const renderer = new Renderer(containerRef.current, {});
          setRenderer(renderer);
          const prunedMorph = renderer.removeNoDiameterSection(morphology);
          renderer.addMorphology(prunedMorph);
          callback?.(prunedMorph);
        }
      },
      [callback]
    );

    useMorphology({
      modelSelfUrl,
      callback: runRenderer,
    });

    useImperativeHandle(
      ref,
      () => ({
        container: containerRef.current,
        cursor: cursorHoverRef.current,
        renderer: rendererRef,
      }),
      [rendererRef]
    );

    return (
      <div className="relative h-full w-full">
        <div className="h-screen" ref={containerRef} />
        <div
          className="absolute bottom-4 right-4 hidden h-max rounded-sm border bg-white px-2 py-2 text-primary-8 shadow-lg"
          ref={cursorHoverRef}
        />
      </div>
    );
  }
);

MorphologyViewer.displayName = 'MorphologyViewer';
export default MorphologyViewer;
