/**
 * TODO NEXT
 *
 * - probably the zoom in orbitcontrols is configured for the orthographic camera, so we must
 * calculate somehow the zoom to viewport height/width in pixels OR modify the orbitcontrols
 * so that it doesn't touch zoom
 */

'use client';

/* eslint-disable lodash/import-scope */

import { debounce, findIndex, isEqual } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import PreviewMesh from '@/components/experiment-designer/simulation-preview/PreviewMesh';
import {
  cameraConfigAtom,
  DEFAULT_CAMERA_LOOK_AT,
  DEFAULT_MOVIE_CAMERA_POSITION,
  DEFAULT_OVERVIEW_CAMERA_POSITION,
} from '@/state/experiment-designer/visualization';
import { ExpDesignerCameraType } from '@/types/experiment-designer-visualization';
import { expDesignerConfigAtom } from '@/state/experiment-designer';
import { ExpDesignerPositionParameter, TargetList } from '@/types/experiment-designer';
import simPreviewThreeCtxWrapper from '@/components/experiment-designer/simulation-preview/SimulationPreview/SimPreviewThreeCtxWrapper';
import CameraSwitch from '@/components/experiment-designer/simulation-preview/SimulationPreview/CameraSwitch';
import ResetViewButton from '@/components/experiment-designer/simulation-preview/SimulationPreview/ResetViewButton';
import ColorLegend from '@/components/experiment-designer/simulation-preview/SimulationPreview/ColorLegend';

interface SimulationPreviewProps {
  targetsToDisplay: TargetList;
}

export default function SimulationPreview({ targetsToDisplay }: SimulationPreviewProps) {
  const [isReady, setIsReady] = useState(false);
  const threeDeeDiv = useRef<HTMLDivElement>(null);
  const [expDesignerConfig, setExpDesignerConfig] = useAtom(expDesignerConfigAtom);
  const [cameraConfig, setCameraConfig] = useAtom(cameraConfigAtom);

  const updateExpDesignerCameraAtom = useCallback(
    (newPosition: [number, number, number]) => {
      const cameraPosIndex = findIndex(expDesignerConfig.imaging, { id: 'cameraPos' });
      const newImagingSection = [...expDesignerConfig.imaging];
      newImagingSection[cameraPosIndex] = {
        ...(newImagingSection[cameraPosIndex] as ExpDesignerPositionParameter),
        value: newPosition,
      };
      const newExpDesignerConfig = { ...expDesignerConfig, imaging: newImagingSection };
      setExpDesignerConfig(newExpDesignerConfig);
    },
    [expDesignerConfig, setExpDesignerConfig]
  );

  const handleCameraControlsChange = useCallback(
    (target: any) => {
      if (!simPreviewThreeCtxWrapper.threeContext) {
        return;
      }

      const { x, y, z } = target.object.position;
      const newPosition = [x, y, z] as [number, number, number];
      const activeCameraKey = cameraConfig.activeCamera;
      const oldPosition = cameraConfig[activeCameraKey].position;

      if (!isEqual(newPosition, oldPosition)) {
        simPreviewThreeCtxWrapper.threeContext.needRender = true;
        setCameraConfig({
          ...cameraConfig,
          [activeCameraKey]: { ...cameraConfig[activeCameraKey], position: newPosition },
        });

        if (activeCameraKey === 'movieCamera') {
          updateExpDesignerCameraAtom(newPosition);
        }
      }
    },
    [cameraConfig, setCameraConfig, updateExpDesignerCameraAtom]
  );

  const controlsChangeDebounced = useMemo(
    () => debounce(handleCameraControlsChange, 500),
    [handleCameraControlsChange]
  );

  useEffect(() => {
    if (threeDeeDiv.current) {
      simPreviewThreeCtxWrapper.init({
        targetDiv: threeDeeDiv.current,
        cameraPositionXYZ: cameraConfig[cameraConfig.activeCamera].position,
        cameraLookAtXYZ: cameraConfig[cameraConfig.activeCamera].lookAt,
      });
      setIsReady(true);

      simPreviewThreeCtxWrapper.threeContext?.setControlsChangeCallback(controlsChangeDebounced);

      simPreviewThreeCtxWrapper.drawCameraLookAtSymbol();
      if (cameraConfig.activeCamera === 'overviewCamera') {
        simPreviewThreeCtxWrapper.drawCameraSymbol(cameraConfig.movieCamera.position);
      }
    }
  }, [cameraConfig, controlsChangeDebounced]);

  const switchCamera = useCallback(
    (isMovieCameraChecked?: boolean) => {
      let newActiveCamera: ExpDesignerCameraType;
      if (typeof isMovieCameraChecked !== 'undefined') {
        newActiveCamera = isMovieCameraChecked ? 'movieCamera' : 'overviewCamera';
      } else {
        newActiveCamera =
          cameraConfig.activeCamera === 'overviewCamera' ? 'movieCamera' : 'overviewCamera';
      }
      setCameraConfig({ ...cameraConfig, activeCamera: newActiveCamera });
    },
    [cameraConfig, setCameraConfig]
  );

  const defaultCameraPosition = useMemo(
    () =>
      cameraConfig.activeCamera === 'overviewCamera'
        ? DEFAULT_OVERVIEW_CAMERA_POSITION
        : DEFAULT_MOVIE_CAMERA_POSITION,
    [cameraConfig.activeCamera]
  );

  const resetCamera = useCallback(() => {
    const newConfig = {
      ...cameraConfig,
      [cameraConfig.activeCamera]: {
        ...cameraConfig[cameraConfig.activeCamera],
        position: defaultCameraPosition,
        lookAt: DEFAULT_CAMERA_LOOK_AT,
      },
    };
    setCameraConfig(newConfig);
  }, [cameraConfig, defaultCameraPosition, setCameraConfig]);

  const isResetViewButtonDisabled = useMemo(
    () => isEqual(cameraConfig[cameraConfig.activeCamera].position, defaultCameraPosition),
    [cameraConfig, defaultCameraPosition]
  );

  const isMovieCameraActive = useMemo(
    () => cameraConfig.activeCamera === 'movieCamera',
    [cameraConfig.activeCamera]
  );

  useEffect(() => {
    simPreviewThreeCtxWrapper.syncWithCameraState(cameraConfig);
  }, [cameraConfig]);

  return (
    <div className="relative w-full h-full flex items-center">
      <div className="flex items-center w-full h-full overflow-hidden" ref={threeDeeDiv} />
      {isReady && <PreviewMesh targetsToDisplay={targetsToDisplay} />}

      <div className="absolute left-0 top-0 text-white px-6 py-5">
        <CameraSwitch onChange={switchCamera} isChecked={isMovieCameraActive} />
      </div>

      <div className="absolute left-0 bottom-0 py-5 px-6">
        <ColorLegend targetsToDisplay={targetsToDisplay} />
      </div>

      <div className="absolute right-0 top-0 text-white px-6 py-5">
        <ResetViewButton onResetCamera={resetCamera} isDisabled={isResetViewButtonDisabled} />
      </div>
    </div>
  );
}
