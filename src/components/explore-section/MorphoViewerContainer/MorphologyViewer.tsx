import * as React from 'react';
// TODO update morphoviewer library with typings
import morphoviewer from 'morphoviewer';
import swcmorphologyparser from 'swcmorphologyparser';
import withFixedFocusOnMorphology from './withFixedFocusOnMorphology';
import OrientationViewer from './libs/OrientationViewer';
import ScaleViewer from './libs/ScaleViewer';
import MorphoLegend from './MorphoLegend';

import './styles/morpho-viewer.css';

export type MorphoViewerOptions = {
  asPolyline?: boolean;
  focusOn?: boolean;
  onDone?: VoidFunction;
  somaMode?: string;
};

export default function MorphologyViewer({
  data,
  options,
}: {
  data: any;
  options: MorphoViewerOptions;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const orientationRef = React.useRef<HTMLDivElement>(null);
  const scaleRef = React.useRef<HTMLDivElement>(null);
  const [mv, setMorphoViewer] = React.useState();
  const [orientationViewer, setOrientationViewer] = React.useState<OrientationViewer | null>(null);
  const [scaleViewer, setScaleViewer] = React.useState<ScaleViewer | null>(null);

  React.useEffect(() => {
    if (!mv) {
      return;
    }
    // @ts-ignore
    if (!mv.hasSomaData) {
      // Change soma color to black
      // @ts-ignore
      const somaMesh = mv._threeContext.getOrphanedSomaChildren();
      (somaMesh as any)?.material.color.setHex(0x000000);
    }
    // @ts-ignore
    if (mv.hasSomaData && !options.asPolyline) {
      // remove orphaned soma because real one exists, but two are shown
      // this is a bug with morphoviewer and will be fixed
      // TODO update morphoviewer and remove this code.
      // @ts-ignore
      mv._threeContext.removeOrphanedSomaChildren();

      // Change soma color to black
      // @ts-ignore
      mv._threeContext.getSomaChildren().forEach((somaMesh: any) => {
        somaMesh?.material.color.setHex(0x000000);
      });
      // @ts-ignore
      mv._threeContext._render();
    }
    // @ts-ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mv && mv._threeContext]);

  React.useEffect(() => {
    let morphoViewer: any;
    if (!ref.current) {
      return () => {};
    }
    try {
      const swcParser = new swcmorphologyparser.SwcParser();
      swcParser.parse(data);
      const parsedFile = swcParser.getRawMorphology();

      const hasSomaData = parsedFile.soma.points.length > 1;

      morphoViewer = withFixedFocusOnMorphology(new morphoviewer.MorphoViewer(ref.current));
      morphoViewer.hasSomaData = hasSomaData;

      morphoViewer._threeContext._camera.up.negate();
      setMorphoViewer(morphoViewer);
      const morphoViewerOptions = {
        name: 'morphology',
        ...options,
      };
      morphoViewer.addMorphology(parsedFile, morphoViewerOptions);
    } catch (error: any) {
      throw new Error(`Morphology parsing error: ${error.message}`);
    }
    return () => {
      if (morphoViewer) {
        morphoViewer.destroy();
        if (morphoViewer && morphoViewer._threeContext) {
          morphoViewer._threeContext = null;
        }
      }
    };
  }, [ref, data, options]);

  // Orientation Viewer Operations
  React.useEffect(() => {
    if (!orientationRef.current) {
      return () => {};
    }
    if (!orientationViewer) {
      orientationRef.current.innerHTML = ''; // Prevent duplication
      setOrientationViewer(new OrientationViewer(orientationRef.current));
    }
    if (mv && orientationViewer) {
      // @ts-ignore
      orientationViewer.setFollowCamera(mv._threeContext._camera);
    }
    return () => {
      orientationViewer?.destroy();
      setOrientationViewer(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orientationRef, mv, options]);

  // Scale Axis Operations
  React.useEffect(() => {
    let controlEventListenerChangedEvent: VoidFunction | null = null;
    if (!scaleRef.current) {
      return () => {};
    }
    if (!scaleViewer) {
      scaleRef.current.innerHTML = ''; // Prevent duplication
      setScaleViewer(new ScaleViewer(scaleRef.current, 0));
    }
    if (mv && scaleViewer) {
      // @ts-ignore
      scaleViewer.onScaleChange(mv._threeContext.getCameraHeightAtMorpho());
      controlEventListenerChangedEvent = () => {
        // @ts-ignore
        scaleViewer.onScaleChange(mv._threeContext.getCameraHeightAtMorpho());
      };
      // @ts-ignore
      mv._threeContext._controls.addEventListener('change', controlEventListenerChangedEvent);
    }
    return () => {
      scaleViewer?.destroy();
      setScaleViewer(null);
      // @ts-ignore
      mv?._threeContext?._controls?.removeEventListener('change', controlEventListenerChangedEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scaleRef, mv, options]);

  const handleOrientationClick = () => {
    // @ts-ignore
    mv?._threeContext._controls.reset();
    // @ts-ignore
    mv?._threeContext._camera.up.negate();
    // @ts-ignore
    mv?._threeContext.focusOnMorphology();
  };

  return (
    <>
      <MorphoLegend
        isInterneuron={
          // @ts-ignore
          !!mv?.isInterneuron()
        }
        hasApproximatedSoma={
          // @ts-ignore
          !mv?.hasSomaData
        }
      />
      <div className="morpho-viewer" ref={ref} />
      {/* eslint-disable jsx-a11y/no-static-element-interactions */}
      <div
        className="scale"
        ref={scaleRef}
        onClick={handleOrientationClick}
        onKeyDown={handleOrientationClick}
      />
      <div
        className="orientation"
        ref={orientationRef}
        onClick={handleOrientationClick}
        onKeyDown={handleOrientationClick}
      />
    </>
  );
}
