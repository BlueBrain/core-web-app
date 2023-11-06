import * as React from 'react';
// TODO update morphoviewer library with typings
import morphoviewer from 'morphoviewer';
import swcmorphologyparser from 'swcmorphologyparser';
import { Camera } from 'three';
import withFixedFocusOnMorphology from './withFixedFocusOnMorphology';
import OrientationViewer from './libs/OrientationViewer';
import ScaleViewer from './libs/ScaleViewer';
import MorphoLegend from './MorphoLegend';

import './styles/morpho-viewer.css';
import useNotification from '@/hooks/notifications';

export type MorphoViewerOptions = {
  asPolyline?: boolean;
  focusOn?: boolean;
  onDone?: VoidFunction;
  somaMode?: string;
  showScale?: boolean;
  showOrientation?: boolean;
  showLegend?: boolean;
};

type SomaMesh = {
  material: { color: { setHex: (hex: number) => void } };
};

type MorphViewer = {
  destroy: () => void;
  _threeContext: {
    getOrphanedSomaChildren: () => SomaMesh | undefined;
    removeOrphanedSomaChildren: () => void;
    getSomaChildren: () => SomaMesh[];
    _render: () => void;
    _camera: Camera;
    _controls: {
      removeEventListener: (a: string, b: VoidFunction | null) => void;
      addEventListener: (a: string, b: VoidFunction | null) => void;
      reset: () => void;
    };
    getCameraHeightAtMorpho: () => number;
    focusOnMorphology: () => void;
  } | null;
  hasSomaData: boolean;
  isInterneuron: () => boolean;
  addMorphology: (parsedFile: {}, morphoViewerOptions: MorphoViewerOptions) => void;
};

export default function MorphologyViewer({
  data,
  options,
}: {
  data: any;
  options: MorphoViewerOptions;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const mv = React.useRef<MorphViewer>();

  const orientationRef = React.useRef<HTMLDivElement>(null);
  const orientationViewer = React.useRef<OrientationViewer | null>(null);

  const scaleRef = React.useRef<HTMLDivElement>(null);
  const scaleViewer = React.useRef<ScaleViewer | null>(null);
  const { error } = useNotification();

  React.useEffect(() => {
    if (!mv.current) {
      return;
    }
    if (!mv.current.hasSomaData) {
      // Change soma color to black
      const somaMesh = mv.current._threeContext?.getOrphanedSomaChildren();
      somaMesh?.material.color.setHex(0x000000);
    }

    if (mv.current.hasSomaData && !options.asPolyline) {
      // remove orphaned soma because real one exists, but two are shown
      // this is a bug with morphoviewer and will be fixed
      // TODO update morphoviewer and remove this code.

      mv.current._threeContext?.removeOrphanedSomaChildren();

      // Change soma color to black

      mv.current._threeContext?.getSomaChildren().forEach((somaMesh) => {
        somaMesh.material.color.setHex(0x000000);
      });

      mv.current._threeContext?._render();
    }
  }, [options.asPolyline]);

  React.useEffect(() => {
    function initMorphViewer() {
      try {
        if (!ref.current) return;
        const swcParser = new swcmorphologyparser.SwcParser();
        swcParser.parse(data);
        const parsedFile = swcParser.getRawMorphology();

        const hasSomaData = parsedFile.soma.points.length > 1;
        ref.current.style.height = '100%';
        ref.current.style.width = '100%';

        const morphoViewer: MorphViewer = withFixedFocusOnMorphology(
          new morphoviewer.MorphoViewer(ref.current)
        );
        morphoViewer.hasSomaData = hasSomaData;

        morphoViewer._threeContext?._camera.up.negate();

        const morphoViewerOptions = {
          name: 'morphology',
          ...options,
        };
        morphoViewer.addMorphology(parsedFile, morphoViewerOptions);
        mv.current = morphoViewer;
      } catch (e) {
        error('Something went wrong while parsing morphology visualization data');
      }
    }

    initMorphViewer();

    return () => {
      if (mv.current) {
        mv.current.destroy();
        mv.current._threeContext = null;
      }
    };
  }, [data, options, error]);

  // Orientation Viewer Operations
  React.useEffect(() => {
    function initOrientationViewer() {
      if (!orientationRef.current) return;

      if (!orientationViewer.current) {
        orientationRef.current.innerHTML = ''; // Prevent duplication
        orientationViewer.current = new OrientationViewer(orientationRef.current);
      }
      if (mv.current?._threeContext && orientationViewer.current) {
        orientationViewer.current.setFollowCamera(mv.current._threeContext._camera);
      }
    }

    initOrientationViewer();

    return () => {
      orientationViewer.current?.destroy();
      orientationViewer.current = null;
    };
  }, [options]);

  // Scale Axis Operations
  React.useEffect(() => {
    let controlEventListenerChangedEvent: VoidFunction | null = null;
    if (!scaleRef.current) {
      return () => {};
    }
    if (!scaleViewer.current) {
      scaleRef.current.innerHTML = ''; // Prevent duplication
      scaleRef.current.style.height = '100%';
      scaleViewer.current = new ScaleViewer(scaleRef.current, 0);
    }
    if (mv.current && scaleViewer) {
      const height = mv.current._threeContext?.getCameraHeightAtMorpho();
      if (height !== undefined) scaleViewer.current.onScaleChange(height);
      controlEventListenerChangedEvent = () => {
        const height2 = mv.current?._threeContext?.getCameraHeightAtMorpho();
        if (height2 !== undefined) scaleViewer.current?.onScaleChange(height2);
      };

      mv.current?._threeContext?._controls.addEventListener(
        'change',
        controlEventListenerChangedEvent
      );
    }
    return () => {
      scaleViewer.current?.destroy();
      scaleViewer.current = null;
      mv.current?._threeContext?._controls.removeEventListener(
        'change',
        controlEventListenerChangedEvent
      );
    };
  }, [options]);

  const handleOrientationClick = () => {
    mv.current?._threeContext?._controls.reset();
    mv.current?._threeContext?._camera.up.negate();
    mv.current?._threeContext?.focusOnMorphology();
  };

  return (
    <>
      {options.showLegend && (
        <MorphoLegend
          isInterneuron={!!mv.current?.isInterneuron()}
          hasApproximatedSoma={!mv.current?.hasSomaData}
        />
      )}
      <div className={options.showScale ? 'morpho-viewer' : ''} ref={ref} />
      {options.showScale && (
        <div
          role="none"
          className="scale"
          ref={scaleRef}
          onClick={handleOrientationClick}
          onKeyDown={handleOrientationClick}
        />
      )}
      {options.showOrientation && (
        <div
          role="none"
          className="orientation"
          ref={orientationRef}
          onClick={handleOrientationClick}
          onKeyDown={handleOrientationClick}
        />
      )}
    </>
  );
}
