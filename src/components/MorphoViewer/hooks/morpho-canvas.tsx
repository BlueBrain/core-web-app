import { useEffect, useRef } from 'react';
import { GizmoCanvas, MorphologyCanvas } from '@bbp/morphoviewer';
import useNotification from 'antd/es/notification/useNotification';

import { useAccessToken } from '@/components/experiment-interactive/ExperimentInteractive/hooks/current-campaign-descriptor';

export function useMorphoCanvas(
  morphoCanvas: HTMLCanvasElement | null,
  gizmoCanvas: HTMLCanvasElement | null,
  swc: string,
  contentUrl: string
) {
  const accessToken = useAccessToken();
  const refMorphoCanvas = useRef(new MorphologyCanvas());
  const morphoCanvasManager = refMorphoCanvas.current;
  const refGizmoCanvas = useRef(new GizmoCanvas());
  const gizmoCanvasManager = refGizmoCanvas.current;
  const notification = useNotification();

  useGizmoCameraAttachment(gizmoCanvasManager, morphoCanvasManager);

  useEffect(() => {
    morphoCanvasManager.canvas = morphoCanvas;
    morphoCanvasManager.swc = swc;
    if (contentUrl) {
      setEnhancedSomaIsLoading(true);
      fetchSomaFromNeuroMorphoViz(contentUrl, accessToken)
        .then((data) => {
          setEnhancedSomaIsLoading(false);
          if (!data) return;

          morphoCanvasManager.somaGLB = data;
          morphoCanvasManager.paint();
        })
        .catch((err) => {
          setEnhancedSomaIsLoading(false);
          logError('Unable to get a GLB mesh for the soma:', err);
          notification.error('An error occured while retrieving an enhanced soma.');
        });
    }
    const handleWarning = () => {
      setWarning(true);
    };
    morphoCanvasManager.eventMouseWheelWithoutCtrl.addListener(handleWarning);
    gizmoCanvasManager.attachCamera(morphoCanvasManager.camera);
    gizmoCanvasManager.eventTipClick.addListener(morphoCanvasManager.interpolateCamera);
    return () => {
      morphoCanvasManager.eventMouseWheelWithoutCtrl.removeListener(handleWarning);
      gizmoCanvasManager.eventTipClick.removeListener(morphoCanvasManager.interpolateCamera);
    };
  });
}
function useGizmoCameraAttachment(
  gizmoCanvasManager: GizmoCanvas,
  morphoCanvasManager: MorphologyCanvas
) {
  useEffect(() => {
    gizmoCanvasManager.attachCamera(morphoCanvasManager.camera);
    gizmoCanvasManager.eventTipClick.addListener(morphoCanvasManager.interpolateCamera);
    return () => {
      gizmoCanvasManager.eventTipClick.removeListener(morphoCanvasManager.interpolateCamera);
    };
  }, [gizmoCanvasManager, morphoCanvasManager]);
}
