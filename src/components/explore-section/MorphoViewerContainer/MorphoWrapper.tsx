import { Button } from 'antd';

import MorphologyViewer, { MorphoViewerOptions } from './MorphologyViewer';

import './styles/morpho-wrapper.css';

function MorphoWrapper({
  loading,
  error,
  data,
  options,
  onPolylineClick,
}: {
  loading: boolean;
  error: Error | null;
  data: any;
  options: MorphoViewerOptions;
  onPolylineClick: VoidFunction;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-3">
        <h1 className="font-bold text-primary-9 text-lg">Morphology 3D Viewer</h1>
        <Button className="w-fit" size="small" disabled={loading} onClick={onPolylineClick}>
          {options.asPolyline ? 'Show as Geometry' : 'Show as Lines'}
        </Button>
      </div>
      <div className={loading ? 'morpho-wrapper loading' : 'morpho-wrapper'}>
        {error && <p>{error.message}</p>}
        {data && !error && <MorphologyViewer data={data} options={options} />}
      </div>
    </div>
  );
}

export default MorphoWrapper;
