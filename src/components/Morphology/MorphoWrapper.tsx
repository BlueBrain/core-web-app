import { Button } from 'antd';

import MorphologyViewer, { MorphoViewerOptions } from './MorphologyViewer';

import './morpho-wrapper.css';

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
    <div className={loading ? 'morpho-wrapper loading' : 'morpho-wrapper'}>
      {error && <p>{error.message}</p>}
      {data && !error && (
        <>
          <div className="actions">
            <Button size="small" disabled={loading} onClick={onPolylineClick}>
              {options.asPolyline ? 'Show as Geometry' : 'Show as Lines'}
            </Button>
          </div>
          <MorphologyViewer data={data} options={options} />
        </>
      )}
    </div>
  );
}

export default MorphoWrapper;
