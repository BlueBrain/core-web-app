import { Button } from 'antd';
import './styles/morpho-wrapper.css';
import { useMemo } from 'react';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import MorphologyViewer, { MorphoViewerOptions } from './MorphologyViewer';
import createMorphologyDataAtom from '@/components/explore-section/MorphoViewerContainer/state/MorphologyDataAtom';
import { DeltaResource } from '@/types/explore-section/resources';

function MorphoWrapper({
  options,
  onPolylineClick,
  resource,
  hideTitleOptions,
}: {
  options: MorphoViewerOptions;
  onPolylineClick: VoidFunction;
  resource: DeltaResource;
  hideTitleOptions?: boolean;
}) {
  const morphologyDataAtom = useMemo(
    () => loadable(createMorphologyDataAtom(resource)),
    [resource]
  );

  const morphologyData = useAtomValue(morphologyDataAtom);

  return (
    <div className="flex flex-col h-full gap-3">
      {!hideTitleOptions && (
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-primary-9 text-lg">Morphology 3D Viewer</h1>
          <Button
            className="w-fit"
            size="small"
            disabled={morphologyData.state === 'loading'}
            onClick={onPolylineClick}
          >
            {options.asPolyline ? 'Show as Geometry' : 'Show as Lines'}
          </Button>
        </div>
      )}
      <div
        className={morphologyData.state === 'loading' ? 'morpho-wrapper loading' : 'morpho-wrapper'}
      >
        {morphologyData.state === 'hasData' && (
          <MorphologyViewer data={morphologyData.data} options={options} />
        )}
      </div>
    </div>
  );
}

export default MorphoWrapper;
